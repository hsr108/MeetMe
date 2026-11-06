import {
  isMediaCaptureSupported,
  isScreenShareSupported,
  getMediaUnsupportedMessage,
} from "./mediaSupport.js";

export const stopStream = (stream) => {
  stream?.getTracks().forEach((track) => track.stop());
};

// Disabled silent audio track, used as a placeholder so peers always have a sender.
const createSilentAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const destination = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  ctx.resume();
  const [track] = destination.stream.getAudioTracks();
  return Object.assign(track, { enabled: false });
};

const createBlackVideoTrack = ({ width = 640, height = 480 } = {}) => {
  const canvas = Object.assign(document.createElement("canvas"), { width, height });
  canvas.getContext("2d").fillRect(0, 0, width, height);
  const [track] = canvas.captureStream().getVideoTracks();
  return Object.assign(track, { enabled: false });
};

export const createBlackSilenceStream = () =>
  new MediaStream([createBlackVideoTrack(), createSilentAudioTrack()]);

// Opens the browser's screen/window/tab picker. Must be called straight from a click handler:
// browsers (Firefox strictly) only allow it during a user gesture. Tab/system audio is asked
// for too; browsers that can't capture it reject the constraint, so retry with video only.
export const requestDisplayStream = async () => {
  try {
    return await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  } catch (err) {
    if (err.name === "TypeError" || err.name === "NotSupportedError") {
      return navigator.mediaDevices.getDisplayMedia({ video: true });
    }
    throw err; // e.g. NotAllowedError when the user cancels the picker
  }
};

const canAccess = async (constraints) => {
  try {
    stopStream(await navigator.mediaDevices.getUserMedia(constraints));
    return true;
  } catch {
    return false;
  }
};

// Asks for camera and mic permission separately, releasing the devices immediately.
// Without the media API (insecure origin) the user joins receive-only.
export const probeMediaAvailability = async () => {
  if (!isMediaCaptureSupported()) {
    console.warn(getMediaUnsupportedMessage());
    return { video: false, audio: false, screen: false };
  }
  const hasVideo = await canAccess({ video: true });
  const hasAudio = await canAccess({ audio: true });
  if (!hasVideo) console.log("Video permission denied");
  if (!hasAudio) console.log("Audio permission denied");
  return {
    video: hasVideo,
    audio: hasAudio,
    screen: isScreenShareSupported(),
  };
};
