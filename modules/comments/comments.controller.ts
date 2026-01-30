import { Request, Response } from "express";
import commentServices from "./comments.service";

const getAllComments = async (req: Request, res: Response) => {
  try {
    const result = await commentServices.getAllComments();
    res.status(200).json({
      success: "true",
      message: "comments fetched successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "comments fetched failed" });
  }
};

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentServices.createComment(req.body);
    res.status(200).json({
      success: "true",
      message: "comment created successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "comments creation failed",
      error: err,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.commentId);
    const result = await commentServices.getCommentById(id);
    res.status(200).json({
      success: "true",
      message: "comments fetched successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "comments fetched failed" });
  }
};

const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const id = req.params.authorId;
    const result = await commentServices.getCommentByAuthor(id);
    res.status(200).json({
      success: "true",
      message: "comments fetched successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "comments fetched failed" });
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user?.id;
    const result = await commentServices.deleteCommentById(
      commentId,
      userId as string,
    );
    res.status(200).json({
      success: "true",
      message: "comment deleted successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "comment deleted failed", error: err });
  }
};

const commentsController = {
  getAllComments,
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteCommentById,
};

export default commentsController;
