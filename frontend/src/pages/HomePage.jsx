import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import JoinByCodeForm from "../features/home/JoinByCodeForm.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { meetingPath } from "../config/routes.js";
import { getErrorMessage } from "../api/apiClient.js";
import "../styles/landing_page.css";
import "../features/home/styles/home.css";

// Logged-in home (/home): the join is recorded in the user's history before entering the call.
function HomePage() {
  const navigate = useNavigate();
  const { addToUserHistory, currentUser } = useAuth();

  const handleJoin = async (meetingCode) => {
    try {
      const res = await addToUserHistory(meetingCode);
      if (!res.data.success) return res.data.message || "Could not join the meeting";
      navigate(meetingPath(meetingCode));
      return null;
    } catch (err) {
      console.error("Error adding to history:", err);
      return getErrorMessage(err, "Could not join the meeting. Please try again.");
    }
  };

  return (
    <div className="Landing-Page-Container">
      <Navbar />
      <div className="home-hero">
        <h1>
          Easily Join and create video calls and meetings
        </h1>
        <p className="home-subtitle">
          {currentUser ? `Welcome back, ${currentUser.name}. ` : ""}
          Enter a meeting code to start.
        </p>
        <JoinByCodeForm onJoin={handleJoin} />
      </div>
    </div>
  );
}

export default HomePage;
