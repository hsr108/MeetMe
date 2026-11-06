export const LIMITS = {
  nameMaxLength: 100,
  usernameMaxLength: 50,
  emailMaxLength: 254,
  passwordMinLength: 1,
  passwordMaxLength: 72, // bcrypt ignores bytes beyond 72
  meetingCodeMaxLength: 200,
};

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const checkLength = (value, max) => value.length <= max;

// Deliberately simple: something@something.tld, no spaces.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (value) => typeof value === "string" && EMAIL_PATTERN.test(value.trim());

// Each validator returns an error message, or null when the input is valid.
// Login's `username` field accepts a username or an email address.
export const validateLoginInput = ({ username, password } = {}) => {
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    return "All fields are required";
  }
  return null;
};

export const validateSignupInput = ({ name, username, email, password } = {}) => {
  const fields = [name, username, email, password];
  if (!fields.every(isNonEmptyString)) return "All fields are required";
  if (!checkLength(name, LIMITS.nameMaxLength)) return "Name is too long";
  if (!checkLength(username, LIMITS.usernameMaxLength)) return "Username is too long";
  if (username.includes("@")) return "Username cannot contain @";
  if (!checkLength(email, LIMITS.emailMaxLength) || !isEmail(email)) {
    return "Enter a valid email address";
  }
  if (!checkLength(password, LIMITS.passwordMaxLength)) return "Password is too long";
  return null;
};

export const validateMeetingCode = (meetingCode) => {
  if (!isNonEmptyString(meetingCode)) return "Meeting code is required";
  if (!checkLength(meetingCode, LIMITS.meetingCodeMaxLength)) return "Meeting code is too long";
  return null;
};
