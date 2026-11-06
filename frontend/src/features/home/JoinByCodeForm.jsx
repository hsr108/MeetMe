import { useState } from "react";
import { isValidMeetingCode, normalizeMeetingCode } from "../join/meetingCode.js";

// Meeting-code input + Join button. onJoin receives the normalized code (e.g. "abc123xyz")
// and may return an error message to show.
function JoinByCodeForm({ onJoin }) {
  const [meetingCode, setMeetingCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidMeetingCode(meetingCode)) {
      setError("Enter valid meeting code");
      return;
    }
    setIsJoining(true);
    const joinError = await onJoin(normalizeMeetingCode(meetingCode));
    setIsJoining(false);
    if (joinError) setError(joinError);
  };

  return (
    <>
      <form className="home-join-form" onSubmit={handleSubmit}>
        <input
          aria-label="Meeting code"
          placeholder="Meeting code, e.g. abc-123-xyz"
          value={meetingCode}
          onChange={(e) => {
            setMeetingCode(e.target.value);
            if (error) setError("");
          }}
        />
        <button type="submit" disabled={!meetingCode.trim() || isJoining}>
          Join
        </button>
      </form>
      <p className="home-join-error">{error}</p>
    </>
  );
}

export default JoinByCodeForm;
