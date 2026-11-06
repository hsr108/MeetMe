import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { ROUTES } from "../config/routes.js";
import HistoryCard from "../features/history/HistoryCard.jsx";
import { sortMeetingsByDate } from "../features/history/formatDate.js";
import "../styles/landing_page.css";
import "../features/history/styles/history.css";

function HistoryPage() {
  const { getHistoryOfUser } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    getHistoryOfUser()
      .then((history) => {
        if (cancelled) return;
        setMeetings(Array.isArray(history) ? sortMeetingsByDate(history) : []);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Could not load meeting history:", err);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [getHistoryOfUser]);

  return (
    <div className="Landing-Page-Container">
      <Navbar />
      <main className="history-page">
        <h1>
          Meeting <span>history</span>
        </h1>
        <p className="history-subtitle">Your meetings, newest first.</p>

        {status === "loading" && <p className="history-empty">Loading…</p>}
        {status === "error" && <p className="history-empty">Could not load your history.</p>}
        {status === "ready" && meetings.length === 0 && (
          <p className="history-empty">
            No meetings yet. <Link to={ROUTES.home}>Join one from the home page</Link>.
          </p>
        )}

        <ul className="history-list">
          {meetings.map((meeting) => (
            <HistoryCard key={meeting._id} meeting={meeting} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default HistoryPage;
