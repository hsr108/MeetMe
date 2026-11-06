import { createContext} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import server from "../environment.js";
import { toast } from "react-toastify";
export const AuthContext = createContext();

const client = axios.create({
  baseURL: `${server}users`, withCredentials: true,              //to allow cookies
});


export const AuthProvider = ({ children }) => {
 
  const router = useNavigate();

  const handleSignup = async (name, username, password) => {
    try {
      let response = await client.post("/signup", {
        name: name,
        username: username,
        password: password,
      });
      if (response.data.success === true) {
        toast.success("Account created successfully! Redirecting...");
        setTimeout(() => router("/home"), 1500);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Signup failed. Please try again.");
      throw err;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let response = await client.post("/login", {
        username: username,
        password: password,
      });
     
      if (response.data.success === true) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => router("/home"), 1500);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
      throw err;
    }
  };

  const getHistoryOfUser = async () => {
    try {
      let response = await client.get("/get_all_activity", {withCredentials: true
        // params: {
        //   token: localStorage.getItem("token"),
        // },
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  };

  let isAuthenticated= async()=>{
    try{  
      let response = await axios.get(`${server}auth/verify_user`, {withCredentials: true});
      return response.data.status;
    }catch(err){  
      throw err;
    }
  }
  const addToUserHistory = async (meetingCode) => {
    try {
      let response = await client.post("/add_to_activity", {
       withCredentials: true,
        meeting_code: meetingCode,
      });

      return response;
    } catch (err) {
      throw err;
    }
  };

  const data = {

    handleSignup,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
    isAuthenticated,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};


