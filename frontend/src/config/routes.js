// Client-side route paths. "/:url" (the meeting room) must stay last in App.jsx.
export const ROUTES = {
  landing: "/",
  auth: "/auth",
  guest: "/guestmeeting",
  join: "/join",
  home: "/home",
  history: "/history",
  meeting: "/:url",
};

export const meetingPath = (meetingCode) => `/${meetingCode}`;
