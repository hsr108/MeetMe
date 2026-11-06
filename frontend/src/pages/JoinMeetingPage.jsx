import { useNavigate } from "react-router-dom";
import { meetingPath } from "../config/routes.js";
import { saveInitialMediaPreferences } from "../utils/sessionPreferences.js";
import { useDisplayName } from "../hooks/useDisplayName.js";
import { useMediaPreview } from "../features/join/useMediaPreview.js";
import JoinVideoPreview from "../features/join/JoinVideoPreview.jsx";
import JoinMeetingForm from "../features/join/JoinMeetingForm.jsx";
import "../features/join/styles/joinLayout.css";
import "../features/join/styles/joinPreview.css";
import "../features/join/styles/joinControls.css";

function JoinMeetingPage() {
  const navigate = useNavigate();
  const preview = useMediaPreview();
  const guestName = useDisplayName();

  const handleJoin = (meetingCode) => {
    // VideoMeetPage reads these preferences and re-acquires the devices itself.
    saveInitialMediaPreferences({ video: preview.videoOn, audio: preview.audioOn });
    preview.stopPreview();
    navigate(meetingPath(meetingCode));
  };

  return (
    <div className="join-page">
      <div className="join-container">
        <JoinVideoPreview preview={preview} initial={guestName.charAt(0)} />
        <JoinMeetingForm guestName={guestName} onJoin={handleJoin} />
      </div>
    </div>
  );
}

export default JoinMeetingPage;
