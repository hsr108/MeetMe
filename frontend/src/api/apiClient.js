import axios from "axios";
import server from "../config/environment.js";

// withCredentials sends the httpOnly auth cookie on every request.
export const usersClient = axios.create({
  baseURL: `${server}users`,
  withCredentials: true,
});

export const authClient = axios.create({
  baseURL: `${server}auth`,
  withCredentials: true,
});

export const getErrorMessage = (err, fallback) => err?.response?.data?.message || fallback;
