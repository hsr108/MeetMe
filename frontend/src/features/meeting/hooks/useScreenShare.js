import { useCallback, useRef, useState } from "react";
import {
  createBlackSilenceStream,
  requestDisplayStream,
  stopStream,
} from "../media/mediaStreams.js";
import { isScreenShareSupported } from "../media/mediaSupport.js";

// Screen sharing replaces the camera stream; stopping it restores camera/mic.
// `screen` turns true only once the screen stream has arrived, so the UI (mirroring, button
// state) never changes while the picker is open or after it is cancelled.
// isSharingRef tells useUserMedia not to replace the shared screen with the camera.
export const useScreenShare = ({ mesh, showLocal, restoreUserMedia, isSharingRef }) => {
  const [screen, setScreen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const displayStreamRef = useRef(null);

  const stopSharing = useCallback(() => {
    const stream = displayStreamRef.current;
    if (!stream) return;
    displayStreamRef.current = null;
    isSharingRef.current = false;
    setScreen(false);

    // Show a black/silent placeholder until the camera and mic come back.
    const placeholder = createBlackSilenceStream();
    mesh.setLocalStream(placeholder, { renegotiate: false }); // also stops the screen tracks
    showLocal(placeholder);
    stopStream(stream);
    restoreUserMedia();
  }, [mesh, showLocal, restoreUserMedia, isSharingRef]);

  // Runs directly inside the button's click handler (no effect in between), which keeps the
  // browser's user-gesture requirement for getDisplayMedia satisfied.
  const startSharing = async () => {
    if (isStarting || !isScreenShareSupported()) return;
    setIsStarting(true);
    try {
      const stream = await requestDisplayStream();
      displayStreamRef.current = stream;
      isSharingRef.current = true;
      mesh.setLocalStream(stream);
      showLocal(stream);
      setScreen(true);
      // The browser's own "Stop sharing" bar ends the video track.
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (displayStreamRef.current === stream) stopSharing();
      });
    } catch (e) {
      console.log("Screen share was not started:", e.name, e.message);
    } finally {
      setIsStarting(false);
    }
  };

  const toggleScreen = () => (screen ? stopSharing() : startSharing());

  return { screen, isStarting, toggleScreen };
};
