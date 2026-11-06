import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  getGuestName,
  saveGuestDetails,
  saveInitialMediaPreferences,
  getInitialMediaPreferences,
} from "../src/utils/sessionPreferences.js";

beforeEach(() => {
  const store = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
  };
});

test("guest name defaults to Guest", () => {
  assert.equal(getGuestName(), "Guest");
  saveGuestDetails("Ann", "2000");
  assert.equal(getGuestName(), "Ann");
});

test("media preferences default to on and round-trip", () => {
  assert.deepEqual(getInitialMediaPreferences(), { video: true, audio: true });
  saveInitialMediaPreferences({ video: false, audio: true });
  assert.deepEqual(getInitialMediaPreferences(), { video: false, audio: true });
});
