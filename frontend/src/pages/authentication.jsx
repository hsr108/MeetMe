import { AuthContext } from "../contexts/AuthContext.jsx";
import { useContext } from "react";

import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import { ToastContainer } from "react-toastify";

import "../styles/authentication.css";

function Login({ handleForm }) {
  const { handleLogin } = useContext(AuthContext);

  let [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  let handleOnChange = (event) => {
    setFormData((prevData) => ({  
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  let handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    try {
      handleLogin(formData.username, formData.password);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="hero-signupForm" style={{ height: "20rem" }}>
      <h1 className="forh1">Login on MeetMe</h1>

      <form onSubmit={handleLoginFormSubmit}>
        <div className="signup-form-inputs">
          <TextField
            id="login-username"
            name="username"
            label="Username"
            variant="outlined"
            onChange={handleOnChange}
            value={formData.username}
          />
          <TextField
            id="login-password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            onChange={handleOnChange}
            value={formData.password}
          />

          <Button variant="contained" type="submit">
            Login
          </Button>
        </div>
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-0.6rem",
        }}
      >
        <p className="smalltext">
          Create an Account?{" "}
          <a
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={handleForm}
          >
            SignUp
          </a>
        </p>
      </div>
    </div>
  );
}

function Signup({ handleForm }) {
  const { handleSignup } = useContext(AuthContext);

  let [formData, setFormData] = useState({
    name: "",
    password: "",
    username: "",
  });

  let handleOnChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  let handleSignupFormSubmit = async (e) => {
    e.preventDefault();
    try {
      handleSignup(formData.name, formData.username, formData.password);
    } catch (err) {
      throw err;
    }
  };

  return (
    

    <div className="hero-signupForm ">
      <h1 className="forh1">SignUp on MeetMe</h1>

      <form onSubmit={handleSignupFormSubmit}>
        <div className="signup-form-inputs">
          <TextField
            id="signup-name"
            name="name"
            label="Name"
            variant="outlined"
            onChange={handleOnChange}
            value={formData.name}
          />
          <TextField
            id="signup-username"
            name="username"
            label="Username"
            variant="outlined"
            onChange={handleOnChange}
            value={formData.username}
          />
          <TextField
            id="signup-password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            onChange={handleOnChange}
            value={formData.password}
          />

          <Button variant="contained" type="submit">
            Create Account
          </Button>
          
        </div>

        
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "0.4rem",
        }}
      >
        <p className="smalltext">
          Already Have an Account?{" "}
          <a
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={handleForm}
          >
            Login
          </a>
        </p>
      </div>
      
    </div>
   
  );
}

function Authentication({ modalhandler }) {
  let [signup, setSignup] = useState(true);

  let handleForm = () => {
    setSignup(!signup);
  };

  return (

      <div className="hero-image-signupForm">
        <div className="left-image"><img src="/videocall.png" alt="Video Call" /></div>
        <div className="right-form">
          <div className="modal-header" role="button" onClick={modalhandler}><i className="fa-solid fa-xmark"></i></div>
          {signup ? (
            <Signup handleForm={handleForm} />
          ) : (
            <Login handleForm={handleForm} />
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>

  );
}

export default Authentication;
