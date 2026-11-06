function MediaToggleButton({ isOn, onClick, onTitle, offTitle, onIcon, offIcon }) {
  return (
    <button
      className={`join-media-btn ${!isOn ? "off" : ""}`}
      onClick={onClick}
      title={isOn ? onTitle : offTitle}
    >
      <i className={`fa-solid ${isOn ? onIcon : offIcon}`} />
    </button>
  );
}

function StatusItem({ label, isOn }) {
  return (
    <span className="join-status-item">
      <span className={`join-status-dot ${!isOn ? "inactive" : ""}`} />
      {label} {isOn ? "On" : "Off"}
    </span>
  );
}

// Left half of the lobby: camera preview, media toggles and status dots.
function JoinVideoPreview({ preview, initial }) {
  const { videoRef, videoOn, audioOn, mediaError, toggleVideo, toggleAudio } = preview;

  return (
    <div className="join-video-section">
      <div className="join-video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ display: videoOn ? "block" : "none" }}
        />
        {!videoOn && (
          <div className="join-video-off-placeholder">
            <div className="avatar-circle">{initial}</div>
            <p>Camera is off</p>
            {mediaError && <p className="join-media-warning">{mediaError}</p>}
          </div>
        )}
      </div>

      <div className="join-media-controls">
        <MediaToggleButton
          isOn={videoOn}
          onClick={toggleVideo}
          onTitle="Turn off camera"
          offTitle="Turn on camera"
          onIcon="fa-video"
          offIcon="fa-video-slash"
        />
        <MediaToggleButton
          isOn={audioOn}
          onClick={toggleAudio}
          onTitle="Mute microphone"
          offTitle="Unmute microphone"
          onIcon="fa-microphone"
          offIcon="fa-microphone-slash"
        />
      </div>

      <div className="join-status-row">
        <StatusItem label="Camera" isOn={videoOn} />
        <StatusItem label="Mic" isOn={audioOn} />
      </div>
    </div>
  );
}

export default JoinVideoPreview;
