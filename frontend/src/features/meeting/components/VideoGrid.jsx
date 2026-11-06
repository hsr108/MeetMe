import { memo } from "react";
import styles from "../styles/videoGrid.module.css";
import LocalVideoCard from "./LocalVideoCard.jsx";
import RemoteVideoCard from "./RemoteVideoCard.jsx";

// Memoized so typing in the chat does not re-render the video tiles.
function VideoGrid({
  localVideoRef,
  username,
  videoOn,
  audioOn,
  mirrorLocal,
  remoteVideos,
  participantNames,
}) {
  const gridClassName = `${styles.videoGrid} ${
    remoteVideos.length === 0 ? styles.singleParticipant : ""
  }`;

  return (
    <div className={gridClassName}>
      <LocalVideoCard
        videoRef={localVideoRef}
        username={username}
        videoOn={videoOn}
        audioOn={audioOn}
        mirrored={mirrorLocal}
      />
      {remoteVideos.map((remote) => (
        <RemoteVideoCard
          key={remote.socketId}
          socketId={remote.socketId}
          stream={remote.stream}
          name={participantNames[remote.socketId]}
        />
      ))}
    </div>
  );
}

export default memo(VideoGrid);
