// Meeting code: 3 letters, 3 digits, 3 letters (e.g. abc123xyz or abc-123-xyz).
const MEETING_CODE_PATTERN = /^[A-Za-z]{3}-?\d{3}-?[A-Za-z]{3}$/;

export const isValidMeetingCode = (code) => MEETING_CODE_PATTERN.test(code.trim());

// Canonical form used for URLs and signaling rooms: "ABC-123-xyz" → "abc123xyz".
export const normalizeMeetingCode = (code) => code.trim().toLowerCase().replace(/-/g, "");
