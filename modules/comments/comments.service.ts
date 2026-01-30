import { prisma } from "../../lib/prisma";

const getAllComments = async () => {
  try {
    const result = await prisma.comment.findMany();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: number;
  parentId?: number;
}) => {
  try {
    await prisma.post.findUniqueOrThrow({
      where: {
        id: payload.postId,
      },
    });
    if (payload.parentId) {
      await prisma.comment.findUniqueOrThrow({
        where: {
          id: payload.parentId,
        },
      });
    }
    const result = await prisma.comment.create({
      data: {
        content: payload.content,
        postId: payload.postId,
        authorId: payload.authorId,
        parentId: payload.parentId,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getCommentById = async (id: number) => {
  try {
    const result = await prisma.comment.findUnique({
      where: {
        id,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getCommentByAuthor = async (id: string) => {
  try {
    const result = await prisma.comment.findMany({
      where: {
        authorId: id,
      },
      include: {
        replies: true,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteCommentById = async (commentId: number, userId: string) => {
  try {
    console.log(commentId);
    const userData = await prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId: userId,
      },
    });
    if (!userData) throw new Error("forbidden access");
    const result = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const commentServices = {
  getAllComments,
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteCommentById,
};

export default commentServices;
