import { memo, useEffect, useRef } from "react";
import styles from "../styles/videoGrid.module.css";

// Attaches the stream only when it changes, not on every parent render.
function RemoteVideoCard({ socketId, stream, name }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={styles.videoCard}>
      <video ref={videoRef} data-socket={socketId} autoPlay playsInline />
      <div className={styles.videoCardName}>
        <span>{name || "Participant"}</span>
      </div>
    </div>
  );
}

export default memo(RemoteVideoCard);
