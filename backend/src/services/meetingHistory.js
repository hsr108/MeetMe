import { Meeting } from "../models/Meeting.js";
import { CallSession } from "../models/CallSession.js";

// The user's history, newest first. Each row gets `participants`: the display names of
// everyone in that call, or null when no call session was recorded (older rows).
export const getMeetingHistory = async (username) => {
  const meetings = await Meeting.find({ user_id: username }).sort({ date: -1 }).lean();

  const sessionIds = [...new Set(meetings.map((m) => m.sessionId).filter(Boolean))];
  const sessions = sessionIds.length
    ? await CallSession.find({ _id: { $in: sessionIds } }).lean()
    : [];
  const participantsBySession = new Map(
    sessions.map((s) => [s._id, s.participants.map((p) => p.name)])
  );

  return meetings.map((meeting) => ({
    ...meeting,
    participants: participantsBySession.get(meeting.sessionId) ?? null,
  }));
};
