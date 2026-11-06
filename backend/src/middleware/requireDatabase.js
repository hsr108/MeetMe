import httpStatus from "http-status";
import { isDatabaseConnected } from "../db/connectDatabase.js";

// Fails fast with 503 instead of letting Mongoose buffer the query and time out.
const requireDatabase = (req, res, next) => {
  if (isDatabaseConnected()) return next();
  return res
    .status(httpStatus.SERVICE_UNAVAILABLE)
    .json({ message: "Database unavailable, please try again later" });
};

export default requireDatabase;
