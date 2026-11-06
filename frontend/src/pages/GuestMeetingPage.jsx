import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes.js";
import { saveGuestDetails } from "../utils/sessionPreferences.js";
import { validateGuestDetails, digitsOnly } from "../features/guest/validateGuestDetails.js";
import "../features/guest/styles/guestPage.css";
import "../features/guest/styles/guestForm.css";

function GuestMeetingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [yob, setYob] = useState("");
  const [errors, setErrors] = useState({});

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const validationErrors = validateGuestDetails(name, yob);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    saveGuestDetails(name.trim(), yob.trim());
    navigate(ROUTES.join);
  };

  return (
    <div className="guest-page">
      <div className="guest-card">
        <h1>
          Welcome to <span>MeetMe</span>
        </h1>
        <p className="subtitle">Tell us a little about yourself to get started.</p>

        <form className="guest-form" onSubmit={handleContinue}>
          <div className="guest-input-group">
            <label htmlFor="guest-name">Your Name</label>
            <input
              id="guest-name"
              type="text"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              autoFocus
            />
            {errors.name && <span className="guest-error">{errors.name}</span>}
          </div>

          <div className="guest-input-group">
            <label htmlFor="guest-yob">Year of Birth</label>
            <input
              id="guest-yob"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2000"
              maxLength={4}
              value={yob}
              onChange={(e) => {
                setYob(digitsOnly(e.target.value));
                clearError("yob");
              }}
            />
            {errors.yob && <span className="guest-error">{errors.yob}</span>}
          </div>

          <button
            type="submit"
            className="guest-continue-btn"
            disabled={!name.trim() || !yob.trim()}
          >
            Continue →
          </button>
        </form>
      </div>
    </div>
  );
}

export default GuestMeetingPage;
