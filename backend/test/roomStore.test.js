import { test } from "node:test";
import assert from "node:assert/strict";
import { createRoomStore, MAX_MESSAGES_PER_ROOM } from "../src/socket/roomStore.js";

test("join adds members in order and is idempotent", () => {
  const store = createRoomStore();
  store.join("room", "a");
  store.join("room", "b");
  const { members } = store.join("room", "a");
  assert.deepEqual(members, ["a", "b"]);
  assert.equal(store.getRoom("b"), "room");
});

test("joining another room leaves the previous one", () => {
  const store = createRoomStore({ createSessionId: () => "s1" });
  store.join("r1", "a");
  store.join("r1", "b");
  const { left } = store.join("r2", "a");
  assert.deepEqual(left, { roomId: "r1", remaining: ["b"], sessionId: "s1" });
  assert.deepEqual(store.getMembers("r1"), ["b"]);
});

test("leave removes empty rooms and their chat history", () => {
  const store = createRoomStore({ createSessionId: () => "s1" });
  store.join("room", "a");
  store.addMessage("room", { sender: "x", data: "hi", "socket-id-sender": "a" });
  assert.deepEqual(store.leave("a"), { roomId: "room", remaining: [], sessionId: "s1" });
  assert.deepEqual(store.getMembers("room"), []);
  assert.deepEqual(store.getMessages("room"), []);
  assert.equal(store.leave("a"), null);
});

test("chat history is capped", () => {
  const store = createRoomStore();
  store.join("room", "a");
  for (let i = 0; i < MAX_MESSAGES_PER_ROOM + 5; i++) {
    store.addMessage("room", { sender: "x", data: String(i), "socket-id-sender": "a" });
  }
  const history = store.getMessages("room");
  assert.equal(history.length, MAX_MESSAGES_PER_ROOM);
  assert.equal(history[0].data, "5");
});

test("areInSameRoom only matches members of one room", () => {
  const store = createRoomStore();
  store.join("r1", "a");
  store.join("r1", "b");
  store.join("r2", "c");
  assert.equal(store.areInSameRoom("a", "b"), true);
  assert.equal(store.areInSameRoom("a", "c"), false);
  assert.equal(store.areInSameRoom("a", "unknown"), false);
});

test("a session id lasts from the first join until the room empties", () => {
  let next = 0;
  const store = createRoomStore({ createSessionId: () => `s${++next}` });
  assert.equal(store.join("room", "a", "Ann").sessionId, "s1");
  assert.equal(store.join("room", "b", "Bob").sessionId, "s1");
  assert.deepEqual(store.getNames("room"), { a: "Ann", b: "Bob" });
  store.leave("a");
  assert.equal(store.leave("b").sessionId, "s1");
  assert.equal(store.join("room", "c", "Cy").sessionId, "s2");
});
