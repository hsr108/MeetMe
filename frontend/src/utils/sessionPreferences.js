// sessionStorage hand-off between the guest → join → meeting pages.
const KEYS = {
  guestName: "guestName",
  guestYob: "guestYob",
  initialVideo: "initialVideo",
  initialAudio: "initialAudio",
};

export const DEFAULT_DISPLAY_NAME = "Guest";

export const getGuestName = () => sessionStorage.getItem(KEYS.guestName) || DEFAULT_DISPLAY_NAME;

export const saveGuestDetails = (name, yob) => {
  sessionStorage.setItem(KEYS.guestName, name);
  sessionStorage.setItem(KEYS.guestYob, yob);
};

export const saveInitialMediaPreferences = ({ video, audio }) => {
  sessionStorage.setItem(KEYS.initialVideo, video ? "true" : "false");
  sessionStorage.setItem(KEYS.initialAudio, audio ? "true" : "false");
};

// Missing preference means "on" (e.g. when the meeting URL is opened directly).
export const getInitialMediaPreferences = () => ({
  video: sessionStorage.getItem(KEYS.initialVideo) !== "false",
  audio: sessionStorage.getItem(KEYS.initialAudio) !== "false",
});
