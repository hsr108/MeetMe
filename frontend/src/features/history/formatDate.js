const pad2 = (value) => value.toString().padStart(2, "0");

// "2025-06-30T10:00:00Z" → "30/06/2025" (local time zone)
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
};

// "2025-06-30T15:05:00" → "3:05 PM" (local time zone)
export const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

// Newest first; the server already sorts, this keeps the page correct regardless.
export const sortMeetingsByDate = (meetings) =>
  [...meetings].sort((a, b) => new Date(b.date) - new Date(a.date));
