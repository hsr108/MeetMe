import { useState } from "react";
import { isValidMeetingCode, normalizeMeetingCode } from "./meetingCode.js";

// Right half of the lobby: meeting-code input and Join button.
function JoinMeetingForm({ guestName, onJoin }) {
  const [meetingCode, setMeetingCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (!meetingCode.trim()) {
      setError("Please enter a meeting code");
      return;
    }
    if (!isValidMeetingCode(meetingCode)) {
      setError("Enter valid meeting code");
      return;
    }
    onJoin(normalizeMeetingCode(meetingCode));
  };

  return (
    <div className="join-controls-section">
      <div className="join-controls-card">
        <h2>
          Ready to join, <span>{guestName}</span>?
        </h2>
        <p className="join-subtitle">Enter a meeting code to connect with others.</p>

        <div className="join-meeting-input-group">
          <label htmlFor="meeting-code">Meeting Code</label>
          <input
            id="meeting-code"
            type="text"
            placeholder="e.g. abc-123-xyz"
            value={meetingCode}
            onChange={(e) => {
              setMeetingCode(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
          />
        </div>

        {error && <p className="join-error">{error}</p>}

        <button className="join-meeting-btn" onClick={handleJoin} disabled={!meetingCode.trim()}>
          Join Meeting
        </button>
      </div>
    </div>
  );
}

export default JoinMeetingForm;
