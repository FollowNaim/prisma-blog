import express from "express";
import postControllers from "./post.controller";

const router = express.Router();

router.get("/", postControllers.getAllPosts);

router.post("/create", postControllers.createPost);

const postRouter = router;

export default postRouter;
