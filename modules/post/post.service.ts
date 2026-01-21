import { Post, PostStatus } from "../../generated/prisma/client";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags?.length) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({ isFeatured });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (authorId) {
    andConditions.push({ authorId });
  }

  const result = await prisma.post.findMany({
    take: limit,
    skip: skip,

    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const count = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: result,
    total: count,
    currentPage: page,
    currentLimit: limit,
    totalPages: Math.ceil(count / limit),
  };
};

const getPostById = async (id: number) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      await prisma.post.update({
        where: {
          id,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
      const postData = await prisma.post.findUnique({
        where: {
          id,
        },
      });
      return postData;
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const postServices = { createPost, getAllPosts, getPostById };

export default postServices;
