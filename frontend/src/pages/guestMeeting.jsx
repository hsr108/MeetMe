import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/guestMeeting.css";

function GuestMeeting() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [yob, setYob] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!yob.trim()) {
      newErrors.yob = "Year of birth is required";
    } else {
      const year = parseInt(yob, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        newErrors.yob = `Enter a valid year (1900–${currentYear})`;
      }
    }
    return newErrors;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Save guest data to sessionStorage so JoinMeeting can read it
    sessionStorage.setItem("guestName", name.trim());
    sessionStorage.setItem("guestYob", yob.trim());
    navigate("/join");
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
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
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
                // Only allow digits
                const val = e.target.value.replace(/\D/g, "");
                setYob(val);
                if (errors.yob) setErrors((prev) => ({ ...prev, yob: "" }));
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

export default GuestMeeting;
