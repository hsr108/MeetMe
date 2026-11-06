import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./src/routes/users_routes.js";
import authRouter from "./src/routes/AuthRoute.js";
import cookieParser from "cookie-parser";
// import authRoute from"./Routes/AuthRoute";
import dotenv from "dotenv";
dotenv.config();

import {connectToSocket} from "./src/controllers/socketManager.js";

const uri = process.env.MONGO_URI || "mongodb+srv://MeetMe:MeetMe@meetme.gqz6xsd.mongodb.net/?appName=MeetMe";

const app = express();

const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 5001));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://meetme-frontend.onrender.com"
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true }));

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";


// __dirname replacement for ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));


mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(app.get("port"), () => {
      console.log(`🚀 Server running on port ${app.get("port") } at http://localhost:${app.get("port")}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

app.get("/" , (req,res) => {    
 res.sendFile(join(__dirname, "index.html"));
})

app.use("/users", userRouter);
app.use("/auth", authRouter);




