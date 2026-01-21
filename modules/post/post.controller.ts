import { Request, Response } from "express";
import { PostStatus } from "../../generated/prisma/enums";
import paginationHelper from "../../helpers/PaginationSortingHelper";
import postServices from "./post.service";

const getAllPosts = async (req: Request, res: Response) => {
  const { search } = req.query;
  const searchString = typeof search === "string" ? search : undefined;
  const isFeatured = req.query.isFeatured
    ? req.query.isFeatured === "true"
      ? true
      : req.query.isFeatured === "false"
        ? false
        : undefined
    : undefined;
  const status = req.query.status as PostStatus | undefined;
  const authorId = req.query.authorId as string | undefined;
  const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(req.query);
  paginationHelper(req.query);
  try {
    const data = await postServices.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res
      .status(201)
      .json({ success: "true", message: "Post fetched successfully", data });
  } catch (err) {
    res.status(400).json({ success: false, message: "post fetched failed" });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ success: false, message: "unauthorized" });
    }
    await postServices.createPost(req.body, user?.id);
    res.status(201).json({ success: "true", message: "Post created success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "post created failed" });
  }
};

const postControllers = { createPost, getAllPosts };

export default postControllers;
