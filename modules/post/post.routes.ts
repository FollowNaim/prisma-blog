import express from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth";
import postControllers from "./post.controller";
const router = express.Router();

router.get("/", postControllers.getAllPosts);

router.post(
  "/create",
  authMiddleware(UserRole.admin),
  postControllers.createPost
);

const postRouter = router;

export default postRouter;
