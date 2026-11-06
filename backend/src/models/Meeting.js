import mongoose from "mongoose";

// One row per time a logged-in user joined a meeting (shown on the History page).
const meetingSchema = new mongoose.Schema({
  user_id: { type: String, index: true }, // stores the username, not the Mongo _id
  meetingCode: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  // The CallSession this join belonged to (who else was there); null for older rows.
  sessionId: { type: String, default: null },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
