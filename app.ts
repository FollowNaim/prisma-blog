import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./lib/auth";
import postRouter from "./modules/post/post.routes";

const app = express();

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);

export default app;
