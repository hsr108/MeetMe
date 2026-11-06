import httpStatus from "http-status";
import { Meeting } from "../models/Meeting.js";
import { validateMeetingCode } from "../validators/inputValidators.js";
import { getMeetingHistory } from "../services/meetingHistory.js";

// Both handlers run behind requireAuth, which sets req.user.

const getUserHistory = async (req, res) => {
  try {
    return res.json(await getMeetingHistory(req.user.username));
  } catch (err) {
    console.error("Fetching history failed:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

const addToHistory = async (req, res) => {
  const { meeting_code: meetingCode } = req.body;
  const validationError = validateMeetingCode(meetingCode);
  if (validationError) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: validationError });
  }

  try {
    await Meeting.create({ user_id: req.user.username, meetingCode: meetingCode.trim() });
    return res.json({ success: true, message: "Added code to history{ new Meeting Created } " });
  } catch (err) {
    console.error("Adding to history failed:", err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export { getUserHistory, addToHistory };
