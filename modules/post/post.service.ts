import { Post } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPosts = async () => {
  const result = await prisma.post.findMany();
  return result;
};

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "udpatedAt">
) => {
  const result = await prisma.post.create({
    data,
  });
  return result;
};

const postServices = { createPost, getAllPosts };

export default postServices;
