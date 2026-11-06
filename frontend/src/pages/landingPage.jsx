import Navbar from "../Navbar.jsx";
import "../styles/landing_page.css";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Authentication from "./authentication.jsx";
function LandingPage() {
   
  let [openModal , setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleModal = ()=>{
    console.log("modal triggered");
     setOpenModal(!openModal);
  }



  return (
    <>
      <div  className={`modal-overlay ${openModal ? "active" : ""}`}  id="modalOverlay">
        <div  className={`modal ${openModal ? "modalActive" : ""}`} id="modal">

          <Authentication modalhandler={handleModal}/>
        </div>
      </div>

    <div className="Landing-Page-Container">
          <Navbar modalMethod={handleModal} />

      <div className="Hero-section">
          <div className="Hero-text">
            <h1>
              <span style={{ color: "rgba(255, 145, 18, 1)" }}>Connect</span> With
              Your Loved Ones
            </h1>
            <h2>Cover a distance by MeetMe</h2>
            <Button 
              variant="contained" 
              sx={{ textTransform: 'none', backgroundColor: "rgba(255, 145, 18, 1)" }}
              onClick={() => navigate("/guestmeeting")}
            >
              Get Started 
            </Button>
          </div>
          <div className="Hero-img">
            <img src="/laptop.avif" alt="Hero Image" />
          </div>
      </div>
    </div>
    </>
  );
}

export default LandingPage;