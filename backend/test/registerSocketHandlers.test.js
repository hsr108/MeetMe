import { test } from "node:test";
import assert from "node:assert/strict";
import { createRoomStore } from "../src/socket/roomStore.js";
import { registerSocketHandlers } from "../src/socket/registerSocketHandlers.js";

// Minimal fakes: io.to(target).emit records [targets, event, ...args].
const createFakeServer = (recorder) => {
  const sent = [];
  const io = {
    to: (target) => ({
      emit: (event, ...args) => sent.push([[].concat(target), event, ...args]),
    }),
  };
  const connect = (store, id) => {
    const handlers = {};
    const socket = {
      id,
      on: (event, handler) => (handlers[event] = handler),
      emit: (event, ...args) => sent.push([[id], event, ...args]),
    };
    registerSocketHandlers(io, socket, store, recorder);
    return handlers;
  };
  return { sent, connect };
};

test("join-call announces the joiner with everyone's display name", () => {
  const { sent, connect } = createFakeServer();
  const store = createRoomStore();
  connect(store, "a")["join-call"]("room", "Ann");
  connect(store, "b")["join-call"]("room", "  Bob ");
  assert.deepEqual(sent.at(-1), [
    ["a", "b"],
    "user-joined",
    "b",
    ["a", "b"],
    { a: "Ann", b: "Bob" },
  ]);
});

test("the recorder sees each join and the end of the call", () => {
  const events = [];
  const recorder = {
    onParticipantJoined: (info) => events.push(["joined", info.name, info.username]),
    onSessionEnded: (sessionId) => events.push(["ended", typeof sessionId]),
  };
  const { connect } = createFakeServer(recorder);
  const store = createRoomStore();
  const a = connect(store, "a");
  a["join-call"]("room", "Ann");
  const b = connect(store, "b");
  b["join-call"]("room");
  b.disconnect();
  a.disconnect();
  assert.deepEqual(events, [
    ["joined", "Ann", null],
    ["joined", "Guest", null],
    ["ended", "string"],
  ]);
});

test("signal is relayed only within the same room", () => {
  const { sent, connect } = createFakeServer();
  const store = createRoomStore();
  const a = connect(store, "a");
  connect(store, "b")["join-call"]("room");
  connect(store, "c")["join-call"]("other");
  a["join-call"]("room");
  sent.length = 0;

  a.signal("b", '{"sdp":{}}');
  a.signal("c", '{"sdp":{}}');
  assert.deepEqual(sent, [[["b"], "signal", "a", '{"sdp":{}}']]);
});

test("chat-message is broadcast once to the room and replayed to late joiners", () => {
  const { sent, connect } = createFakeServer();
  const store = createRoomStore();
  const a = connect(store, "a");
  a["join-call"]("room");
  a["chat-message"]("hello", "Ann");
  assert.deepEqual(sent.at(-1), [["a"], "chat-message", "hello", "Ann", "a"]);

  connect(store, "b")["join-call"]("room");
  assert.deepEqual(sent.at(-1), [["b"], "chat-message", "hello", "Ann", "a"]);
});

test("invalid chat messages and non-members are ignored", () => {
  const { sent, connect } = createFakeServer();
  const store = createRoomStore();
  const a = connect(store, "a");
  a["chat-message"]("not in a room", "Ann");
  a["join-call"]("room");
  sent.length = 0;
  a["chat-message"]("   ", "Ann");
  a["chat-message"]({ evil: true }, "Ann");
  assert.equal(sent.length, 0);
});

test("disconnect notifies remaining members", () => {
  const { sent, connect } = createFakeServer();
  const store = createRoomStore();
  connect(store, "a")["join-call"]("room");
  const b = connect(store, "b");
  b["join-call"]("room");
  b.disconnect();
  assert.deepEqual(sent.at(-1), [["a"], "user-left", "b"]);
});
