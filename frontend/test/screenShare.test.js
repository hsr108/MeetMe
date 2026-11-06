import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { requestDisplayStream } from "../src/features/meeting/media/mediaStreams.js";

const fakeNavigator = (behaviour) => {
  const calls = [];
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      mediaDevices: {
        getDisplayMedia: async (constraints) => {
          calls.push(constraints);
          return behaviour(constraints);
        },
      },
    },
  });
  return calls;
};

const domError = (name) => Object.assign(new Error(name), { name });

afterEach(() => delete globalThis.navigator);

test("asks for screen + audio first", async () => {
  const calls = fakeNavigator(() => "stream");
  assert.equal(await requestDisplayStream(), "stream");
  assert.deepEqual(calls, [{ video: true, audio: true }]);
});

test("retries video-only when the browser can't capture audio", async () => {
  const calls = fakeNavigator((c) => {
    if (c.audio) throw domError("TypeError");
    return "video-only";
  });
  assert.equal(await requestDisplayStream(), "video-only");
  assert.deepEqual(calls, [{ video: true, audio: true }, { video: true }]);
});

test("a cancelled picker is not retried", async () => {
  const calls = fakeNavigator(() => {
    throw domError("NotAllowedError");
  });
  await assert.rejects(requestDisplayStream(), { name: "NotAllowedError" });
  assert.equal(calls.length, 1);
});
