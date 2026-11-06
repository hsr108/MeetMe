// Browsers only expose navigator.mediaDevices on secure origins: https:// or localhost.
// Opening the dev server as http://<LAN-IP>:5173 from another device leaves it undefined.
export const isMediaCaptureSupported = () =>
  typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

export const isScreenShareSupported = () =>
  typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getDisplayMedia);

export const getMediaUnsupportedMessage = () =>
  window.isSecureContext
    ? "This browser does not support camera and microphone access."
    : "Camera and microphone need a secure connection. Open this page over https://.";
