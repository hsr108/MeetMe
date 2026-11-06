import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import AuthenticationPage from "./AuthenticationPage.jsx";
import { BRAND_ORANGE } from "../config/theme.js";
import "../styles/landing_page.css";

function LandingPage() {
  const [openModal, setOpenModal] = useState(false);

  const handleModal = () => setOpenModal((prev) => !prev);

  return (
    <>
      <div className={`modal-overlay ${openModal ? "active" : ""}`} id="modalOverlay">
        <div className={`modal ${openModal ? "modalActive" : ""}`} id="modal">
          <AuthenticationPage modalhandler={handleModal} />
        </div>
      </div>

      <div className="Landing-Page-Container">
        <Navbar modalMethod={handleModal} />

        <div className="Hero-section">
          <div className="Hero-text">
            <h1>
              Connect With Your Loved Ones
            </h1>
            <h2>Cover a distance by MeetMe</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
