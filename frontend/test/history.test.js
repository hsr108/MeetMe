import { test } from "node:test";
import assert from "node:assert/strict";
import { sortMeetingsByDate } from "../src/features/history/formatDate.js";

test("history is sorted newest first without mutating the input", () => {
  const meetings = [
    { meetingCode: "old", date: "2026-11-05T10:00:00Z" },
    { meetingCode: "new", date: "2026-11-07T09:00:00Z" },
    { meetingCode: "mid", date: "2026-11-06T23:59:00Z" },
  ];
  assert.deepEqual(sortMeetingsByDate(meetings).map((m) => m.meetingCode), ["new", "mid", "old"]);
  assert.equal(meetings[0].meetingCode, "old");
});
