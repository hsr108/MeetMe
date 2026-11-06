import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import requireDatabase from "./middleware/requireDatabase.js";

const BODY_LIMIT = "40kb";
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

export const createApp = ({ clientOrigins }) => {
  const app = express();

  app.use(cors({ origin: clientOrigins, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: BODY_LIMIT }));
  app.use(express.urlencoded({ limit: BODY_LIMIT, extended: true }));

  app.get("/", (req, res) => {
    res.sendFile(join(projectRoot, "index.html"));
  });

  app.use("/users", requireDatabase, userRouter);
  app.use("/auth", requireDatabase, authRouter);

  return app;
};
