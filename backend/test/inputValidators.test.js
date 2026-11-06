import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateLoginInput,
  validateSignupInput,
  validateMeetingCode,
  isEmail,
  LIMITS,
} from "../src/validators/inputValidators.js";

test("login requires username and password", () => {
  assert.equal(validateLoginInput({ username: "u", password: "p" }), null);
  assert.equal(validateLoginInput({ username: "u" }), "All fields are required");
  assert.equal(validateLoginInput(undefined), "All fields are required");
});

const signup = (overrides) => ({ name: "n", username: "u", email: "a@b.co", password: "p", ...overrides });

test("signup rejects missing, non-string and oversized fields", () => {
  assert.equal(validateSignupInput(signup()), null);
  assert.equal(validateSignupInput(signup({ email: undefined })), "All fields are required");
  assert.equal(validateSignupInput(signup({ username: { $gt: "" } })), "All fields are required");
  const longPassword = "x".repeat(LIMITS.passwordMaxLength + 1);
  assert.equal(validateSignupInput(signup({ password: longPassword })), "Password is too long");
});

test("signup requires a valid email and an @-free username", () => {
  assert.equal(validateSignupInput(signup({ email: "not-an-email" })), "Enter a valid email address");
  assert.equal(validateSignupInput(signup({ email: "a b@c.co" })), "Enter a valid email address");
  assert.equal(validateSignupInput(signup({ username: "u@x" })), "Username cannot contain @");
  assert.equal(isEmail(" A@B.co "), true);
});

test("meeting code must be a non-empty bounded string", () => {
  assert.equal(validateMeetingCode("abc-123"), null);
  assert.equal(validateMeetingCode("  "), "Meeting code is required");
  assert.equal(validateMeetingCode(42), "Meeting code is required");
});
