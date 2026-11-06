import { useParams } from "react-router-dom";
import { isValidMeetingCode } from "../features/join/meetingCode.js";
import VideoMeetPage from "../pages/VideoMeetPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

// "/:url" catches every single-segment address, so only real meeting codes
// (3 letters, 3 digits, 3 letters) open a call; anything else is a 404.
function MeetingRoute() {
  const { url } = useParams();
  return isValidMeetingCode(url ?? "") ? <VideoMeetPage /> : <NotFoundPage />;
}

export default MeetingRoute;
