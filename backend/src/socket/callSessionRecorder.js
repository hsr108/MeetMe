import { CallSession } from "../models/CallSession.js";
import { Meeting } from "../models/Meeting.js";
import { isDatabaseConnected } from "../db/connectDatabase.js";

// A /home Join creates the history row just before the socket joins; link to that row
// if it is this recent, otherwise create one (joins through the lobby or a direct link).
const RECENT_HISTORY_ROW_MS = 15 * 60 * 1000;

const linkHistoryRow = async (username, meetingCode, sessionId) => {
  if (await Meeting.exists({ user_id: username, sessionId })) return; // e.g. page refresh

  const linked = await Meeting.findOneAndUpdate(
    {
      user_id: username,
      meetingCode,
      sessionId: null,
      date: { $gte: new Date(Date.now() - RECENT_HISTORY_ROW_MS) },
    },
    { $set: { sessionId } },
    { sort: { date: -1 } }
  );
  if (!linked) await Meeting.create({ user_id: username, meetingCode, sessionId });
};

// Database side effects of the signaling server. Failures are logged, never thrown,
// so a database problem can't break an ongoing call.
export const createCallSessionRecorder = () => {
  const safely = (label, task) => async (...args) => {
    if (!isDatabaseConnected()) return;
    try {
      await task(...args);
    } catch (err) {
      console.error(`${label} failed:`, err.message);
    }
  };

  const onParticipantJoined = safely(
    "Recording call participant",
    async ({ sessionId, roomId, name, username }) => {
      await CallSession.updateOne(
        { _id: sessionId },
        {
          $setOnInsert: { meetingCode: roomId, startedAt: new Date() },
          $addToSet: { participants: { name, username } },
        },
        { upsert: true }
      );
      if (username) await linkHistoryRow(username, roomId, sessionId);
    }
  );

  const onSessionEnded = safely("Closing call session", (sessionId) =>
    CallSession.updateOne({ _id: sessionId }, { $set: { endedAt: new Date() } })
  );

  return { onParticipantJoined, onSessionEnded };
};
