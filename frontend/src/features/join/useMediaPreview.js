import { useCallback, useEffect, useRef, useState } from "react";
import { stopStream } from "../meeting/media/mediaStreams.js";
import {
  isMediaCaptureSupported,
  getMediaUnsupportedMessage,
} from "../meeting/media/mediaSupport.js";

const removeTracksOfKind = (stream, kind) => {
  stream.getTracks().forEach((track) => {
    if (track.kind !== kind) return;
    track.stop();
    stream.removeTrack(track);
  });
};

// Camera/mic preview for the pre-join lobby. Tracks are stopped, not muted, when toggled off.
export const useMediaPreview = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [mediaSupported] = useState(isMediaCaptureSupported);
  const [videoOn, setVideoOn] = useState(mediaSupported);
  const [audioOn, setAudioOn] = useState(mediaSupported);

  const showStream = (stream) => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    if (!mediaSupported) return undefined;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) return stopStream(stream);
        streamRef.current = stream;
        showStream(stream);
      })
      .catch((err) => {
        console.error("Could not access media devices:", err);
        setVideoOn(false);
        setAudioOn(false);
      });

    return () => {
      cancelled = true;
      stopStream(streamRef.current);
    };
  }, [mediaSupported]);

  // Acquires a fresh track of `kind` and swaps it into the preview stream.
  const enableTrack = async (kind) => {
    const newStream = await navigator.mediaDevices.getUserMedia({ [kind]: true });
    const [track] = newStream.getTracks();
    if (streamRef.current) {
      removeTracksOfKind(streamRef.current, kind);
      streamRef.current.addTrack(track);
    } else {
      streamRef.current = newStream;
    }
  };

  const toggleVideo = async () => {
    if (!mediaSupported) return;
    if (videoOn) {
      if (streamRef.current) removeTracksOfKind(streamRef.current, "video");
      showStream(null);
      setVideoOn(false);
      return;
    }
    try {
      await enableTrack("video");
      showStream(streamRef.current);
      setVideoOn(true);
    } catch (e) {
      console.error("Could not restart video:", e);
    }
  };

  const toggleAudio = async () => {
    if (!mediaSupported) return;
    if (audioOn) {
      if (streamRef.current) removeTracksOfKind(streamRef.current, "audio");
      setAudioOn(false);
      return;
    }
    try {
      await enableTrack("audio");
      setAudioOn(true);
    } catch (e) {
      console.error("Could not restart audio:", e);
    }
  };

  const stopPreview = useCallback(() => stopStream(streamRef.current), []);

  const mediaError = mediaSupported ? null : getMediaUnsupportedMessage();

  return { videoRef, videoOn, audioOn, mediaError, toggleVideo, toggleAudio, stopPreview };
};
