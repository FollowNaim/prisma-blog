import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth";
import commentsController from "./comments.controller";

const router = Router();

router.get("/", commentsController.getAllComments);

router.post(
  "/create",
  authMiddleware(UserRole.admin, UserRole.user),
  commentsController.createComment,
);

router.get("/:commentId", commentsController.getCommentById);

router.get("/author/:authorId", commentsController.getCommentByAuthor);

router.delete("/:commentId", commentsController.deleteCommentById);

const commentsRouter = router;

export default commentsRouter;
