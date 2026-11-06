// Import global CSS from the `public` folder (served at root by Vite)
import "./styles/NavCss.css";
import { Link } from "react-router-dom";
import {Button} from "@mui/material"


function Navbar({ modalMethod }) {
  return (
    <nav>
      <div className="nav-container">
        <div className="nav-logo">
          <h1>
            <span style={{ color: "rgba(255, 145, 18, 1)" }}>Meet</span>
            <span>Me</span>
          </h1>
        </div>
        <div className="nav-links">
          <li>
            {" "}
            <Link style={{ textDecoration: "none", color: "white" }} to="/guestmeeting">
              Join as Guest
            </Link>
          </li>
          <li>
            {" "}
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/signup"
            >
              Register
            </Link>
          </li>
          <li>
            {" "}
            <Button
            onClick={modalMethod}
            
              variant="contained"
              sx={{textTransform: 'none', backgroundColor: "rgba(255, 145, 18, 1)"  , height:"2.2rem"}}
            >
             <i className="fa-solid fa-user"></i>Login/Signup
            </Button>
          </li>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
