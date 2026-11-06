import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "../src/features/history/formatDate.js";
import { validateGuestDetails, digitsOnly } from "../src/features/guest/validateGuestDetails.js";
import { isValidMeetingCode, normalizeMeetingCode } from "../src/features/join/meetingCode.js";
import { getCurrentRoomId } from "../src/features/meeting/signaling/signalingEvents.js";

test("formatDate renders dd/mm/yyyy", () => {
  assert.equal(formatDate(new Date(2025, 0, 5).toISOString()), "05/01/2025");
});

test("validateGuestDetails requires a name and a plausible year", () => {
  assert.deepEqual(validateGuestDetails("Ann", "2000", 2026), {});
  assert.deepEqual(validateGuestDetails(" ", "", 2026), {
    name: "Name is required",
    yob: "Year of birth is required",
  });
  assert.equal(validateGuestDetails("Ann", "1800", 2026).yob, "Enter a valid year (1900–2026)");
  assert.equal(validateGuestDetails("Ann", "2030", 2026).yob, "Enter a valid year (1900–2026)");
});

test("meeting codes must be 3 letters, 3 digits, 3 letters", () => {
  assert.equal(isValidMeetingCode("abc123xyz"), true);
  assert.equal(isValidMeetingCode(" ABC-123-xyz "), true);
  assert.equal(isValidMeetingCode("12345"), false);
  assert.equal(isValidMeetingCode("ab1234xyz"), false);
  assert.equal(isValidMeetingCode("abc123xyz1"), false);
});

test("meeting codes normalize to one room id", () => {
  assert.equal(normalizeMeetingCode(" ABC-123-xyz "), "abc123xyz");
  assert.equal(normalizeMeetingCode("abc123XYZ"), "abc123xyz");
});

test("room id ignores host and protocol", () => {
  globalThis.window = { location: { pathname: "/ABC-123-xyz" } };
  assert.equal(getCurrentRoomId(), "abc123xyz");
  delete globalThis.window;
});

test("digitsOnly strips non-digits", () => {
  assert.equal(digitsOnly("2a0-0b1"), "2001");
});
