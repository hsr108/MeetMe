import { useCallback, useEffect, useRef, useState } from "react";
import { createBlackSilenceStream, stopStream } from "../media/mediaStreams.js";

// Camera + microphone on/off state. Each change re-acquires the devices and renegotiates.
export const useUserMedia = ({ mesh, availability, showLocal, isSharingRef }) => {
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const wantedRef = useRef({ video: false, audio: false });
  const requestIdRef = useRef(0);

  // A device was unplugged or permission revoked: fall back to a black/silent stream.
  const handleTracksEnded = useCallback(() => {
    setVideo(false);
    setAudio(false);
    const placeholder = createBlackSilenceStream();
    mesh.setLocalStream(placeholder);
    showLocal(placeholder);
  }, [mesh, showLocal]);

  // Uses wantedRef so callers outside this hook (screen share) get the current toggles.
  const acquireUserMedia = useCallback(() => {
    const requestId = ++requestIdRef.current;
    // While sharing, keep sending the screen; the latest toggles apply when sharing stops.
    if (isSharingRef.current) return;
    const constraints = {
      video: wantedRef.current.video && availability.video,
      audio: wantedRef.current.audio && availability.audio,
    };

    if (!constraints.video && !constraints.audio) {
      mesh.setLocalStream(null, { renegotiate: false });
      showLocal(null);
      return;
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // A newer toggle superseded this request.
        if (requestId !== requestIdRef.current) return stopStream(stream);
        mesh.setLocalStream(stream);
        showLocal(stream);
        stream.getTracks().forEach((track) => (track.onended = handleTracksEnded));
      })
      .catch((e) => console.log("getUserMedia failed:", e));
  }, [availability, mesh, showLocal, handleTracksEnded, isSharingRef]);

  useEffect(() => {
    if (!availability.probed) return;
    wantedRef.current = { video, audio };
    acquireUserMedia();
  }, [video, audio, availability, acquireUserMedia]);

  const setInitialMedia = useCallback((initialVideo, initialAudio) => {
    setVideo(initialVideo);
    setAudio(initialAudio);
  }, []);

  return {
    video,
    audio,
    toggleVideo: () => setVideo((on) => !on),
    toggleAudio: () => setAudio((on) => !on),
    setInitialMedia,
    acquireUserMedia,
  };
};
