import styles from "../styles/videoGrid.module.css";

const mutedIconStyle = { color: "#ea4335", fontSize: "0.85rem" };

// The <video> element stays mounted (only hidden) so localVideoRef is always attached.
// Mirrored like the lobby preview, except while screen sharing (shared text must read correctly).
function LocalVideoCard({ videoRef, username, videoOn, audioOn, mirrored }) {
  return (
    <div className={styles.videoCard}>
      <video
        ref={videoRef}
        className={mirrored ? styles.mirrored : undefined}
        autoPlay
        muted
        playsInline
        style={{ display: videoOn ? "block" : "none" }}
      />
      {!videoOn && (
        <div className={styles.videoCardAvatar}>
          {username ? username.charAt(0).toUpperCase() : "G"}
        </div>
      )}
      <div className={styles.videoCardName}>
        <span>{username} (You)</span>
        {!audioOn && <i className="fa-solid fa-microphone-slash" style={mutedIconStyle}></i>}
      </div>
    </div>
  );
}

export default LocalVideoCard;
