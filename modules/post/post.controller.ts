import { Request, Response } from "express";
import postServices from "./post.service";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const data = await postServices.getAllPosts();
    res
      .status(201)
      .json({ success: "true", message: "Post fetched successfully", data });
  } catch (err) {
    res.status(400).json({ success: false, message: "post fetched failed" });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    await postServices.createPost(req.body);
    res.status(201).json({ success: "true", message: "Post created success" });
  } catch (err) {
    res.status(400).json({ success: false, message: "post created failed" });
  }
};

const postControllers = { createPost, getAllPosts };

export default postControllers;
