import { Badge } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";
import styles from "../styles/controlBar.module.css";

function ControlButton({ isActive, onClick, title, children, extraClassName = "" }) {
  return (
    <button
      className={`${styles.controlBtn} ${isActive ? styles.active : ""} ${extraClassName}`.trim()}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

// Bottom toolbar. Icons show the current state (e.g. VideocamOff while the camera is off).
function ControlBar({ media, screenShare, canShareScreen, isChatOpen, unreadCount, onToggleChat, onEndCall }) {
  const { video, audio, toggleVideo, toggleAudio } = media;
  const { screen, toggleScreen } = screenShare;

  return (
    <div className={styles.controlBar}>
      <ControlButton isActive={video} onClick={toggleVideo} title={video ? "Turn off video" : "Turn on video"}>
        {video ? <VideocamIcon /> : <VideocamOffIcon />}
      </ControlButton>

      <ControlButton isActive={audio} onClick={toggleAudio} title={audio ? "Mute mic" : "Unmute mic"}>
        {audio ? <MicIcon /> : <MicOffIcon />}
      </ControlButton>

      {canShareScreen && (
        <ControlButton
          isActive={screen}
          onClick={toggleScreen}
          title={screen ? "Stop sharing screen" : "Share screen"}
        >
          {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        </ControlButton>
      )}

      <Badge badgeContent={unreadCount} max={99} color="error">
        <ControlButton isActive={isChatOpen} onClick={onToggleChat} title="Toggle chat">
          <ChatIcon />
        </ControlButton>
      </Badge>

      <ControlButton onClick={onEndCall} title="Leave meeting" extraClassName={styles.disconnect}>
        <CallEndIcon />
      </ControlButton>
    </div>
  );
}

export default ControlBar;
