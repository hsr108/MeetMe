import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/joinMeeting.css";

function JoinMeeting() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [meetingCode, setMeetingCode] = useState("");
  const [error, setError] = useState("");

  // Read guest name from sessionStorage
  const guestName = sessionStorage.getItem("guestName") || "Guest";

  // ── Start the camera/mic on mount ──
  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Could not access media devices:", err);
        setVideoOn(false);
        setAudioOn(false);
      }
    };
    startMedia();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ── Toggle Video ──
  const toggleVideo = async () => {
    if (videoOn) {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((t) => {
          t.stop();
          streamRef.current.removeTrack(t);
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setVideoOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = newStream.getVideoTracks()[0];
        if (streamRef.current) {
          streamRef.current.getVideoTracks().forEach((t) => {
            t.stop();
            streamRef.current.removeTrack(t);
          });
          streamRef.current.addTrack(videoTrack);
        } else {
          streamRef.current = newStream;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
        setVideoOn(true);
      } catch (e) {
        console.error("Could not restart video:", e);
      }
    }
  };

  // ── Toggle Audio ──
  const toggleAudio = async () => {
    if (audioOn) {
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach((t) => {
          t.stop();
          streamRef.current.removeTrack(t);
        });
      }
      setAudioOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = newStream.getAudioTracks()[0];
        if (streamRef.current) {
          streamRef.current.getAudioTracks().forEach((t) => {
            t.stop();
            streamRef.current.removeTrack(t);
          });
          streamRef.current.addTrack(audioTrack);
        } else {
          streamRef.current = newStream;
        }
        setAudioOn(true);
      } catch (e) {
        console.error("Could not restart audio:", e);
      }
    }
  };

  // ── Join the meeting ──
  const handleJoin = () => {
    if (!meetingCode.trim()) {
      setError("Please enter a meeting code");
      return;
    }
    // Save user's preferences so VideoMeet can respect them
    sessionStorage.setItem("initialVideo", videoOn ? "true" : "false");
    sessionStorage.setItem("initialAudio", audioOn ? "true" : "false");
    // Stop all tracks before navigating (VideoMeet will reacquire)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    navigate(`/${meetingCode.trim()}`);
  };

  // Get first letter for the avatar circle
  const initial = guestName.charAt(0);

  return (
    <div className="join-page">
      <div className="join-container">
        {/* ── Left: Video Preview ── */}
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
              </div>
            )}
          </div>

          {/* Media toggle buttons */}
          <div className="join-media-controls">
            <button
              className={`join-media-btn ${!videoOn ? "off" : ""}`}
              onClick={toggleVideo}
              title={videoOn ? "Turn off camera" : "Turn on camera"}
            >
              <i
                className={`fa-solid ${
                  videoOn ? "fa-video" : "fa-video-slash"
                }`}
              />
            </button>
            <button
              className={`join-media-btn ${!audioOn ? "off" : ""}`}
              onClick={toggleAudio}
              title={audioOn ? "Mute microphone" : "Unmute microphone"}
            >
              <i
                className={`fa-solid ${
                  audioOn ? "fa-microphone" : "fa-microphone-slash"
                }`}
              />
            </button>
          </div>

          {/* Status indicators */}
          <div className="join-status-row">
            <span className="join-status-item">
              <span
                className={`join-status-dot ${!videoOn ? "inactive" : ""}`}
              />
              Camera {videoOn ? "On" : "Off"}
            </span>
            <span className="join-status-item">
              <span
                className={`join-status-dot ${!audioOn ? "inactive" : ""}`}
              />
              Mic {audioOn ? "On" : "Off"}
            </span>
          </div>
        </div>

        {/* ── Right: Controls ── */}
        <div className="join-controls-section">
          <div className="join-controls-card">
            <h2>
              Ready to join, <span>{guestName}</span>?
            </h2>
            <p className="join-subtitle">
              Enter a meeting code to connect with others.
            </p>

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

            <button
              className="join-meeting-btn"
              onClick={handleJoin}
              disabled={!meetingCode.trim()}
            >
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinMeeting;
