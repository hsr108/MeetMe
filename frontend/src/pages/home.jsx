import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import withAuth from "../utils/withAuth";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
const Home = () => {
  let navigate = useNavigate();
  let [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    try {
      const res = await addToUserHistory(meetingCode);
      console.log("Response from adding to history:", res);
      if (res.data.success) {
        console.log(res.data.message);
        navigate(`/${meetingCode}`);
        return;
      } else {
        console.error("History update failed");
        return;
      }
    } catch (err) {
      console.error("Error adding to history:", err);
      return;
    }
  };
  let handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        console.log(" User Logout successful");
        navigate("/users/login", { replace: true });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Apna Video Call</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => {
              navigate("/history");
            }}
          >
            <RestoreIcon />
          </IconButton>
          <p>History</p>

          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Call Just Like Quality Education</h2>

            <div style={{ display: "flex", gap: "10px" }}>
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outlined-basic"
                label="Meeting Code"
                variant="outlined"
              />
              <Button onClick={handleJoinVideoCall} variant="contained">
                Join
              </Button>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img srcSet="/logo3.png" alt="" />
        </div>
      </div>
    </>
  );
};

export default withAuth(Home);
