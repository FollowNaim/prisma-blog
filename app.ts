import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import commentsRouter from "./modules/comments/comments.routes";
import postRouter from "./modules/post/post.routes";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);

app.use("/comments", commentsRouter);

export default app;
