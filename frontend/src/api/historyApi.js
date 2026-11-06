import { usersClient } from "./apiClient.js";

export const fetchMeetingHistory = async () => (await usersClient.get("/get_all_activity")).data;

// Resolves with the full axios response (callers read response.data.success).
export const addMeetingToHistory = (meetingCode) =>
  usersClient.post("/add_to_activity", { meeting_code: meetingCode });
