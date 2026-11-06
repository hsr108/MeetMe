import { useState } from "react";
import { formatDate, formatTime } from "./formatDate.js";

// One past meeting: code, date/time and a toggle listing who joined that call.
// meeting.participants is null for older entries recorded before participants were tracked.
function HistoryCard({ meeting }) {
  const [showParticipants, setShowParticipants] = useState(false);
  const participants = meeting.participants;
  const hasParticipants = Array.isArray(participants) && participants.length > 0;

  return (
    <li className="history-card">
      <div className="history-card-main">
        <div>
          <p className="history-label">Meeting code</p>
          <p className="history-code">{meeting.meetingCode}</p>
        </div>
        <div className="history-when">
          <span>{formatDate(meeting.date)}</span>
          <span>{formatTime(meeting.date)}</span>
        </div>
      </div>

      {hasParticipants ? (
        <button
          type="button"
          className="history-toggle"
          onClick={() => setShowParticipants((open) => !open)}
          aria-expanded={showParticipants}
        >
          <i className={`fa-solid ${showParticipants ? "fa-chevron-up" : "fa-users"}`}></i>
          {showParticipants ? "Hide participants" : `Show participants (${participants.length})`}
        </button>
      ) : (
        <p className="history-note">Participants were not recorded for this meeting.</p>
      )}

      {showParticipants && hasParticipants && (
        <ul className="history-participants">
          {participants.map((name, index) => (
            <li key={`${name}-${index}`}>{name}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default HistoryCard;
