import { Comment } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../Errors/AppError";
import status from "http-status";

const addComment = async (commentData: Comment) => {
  //   console.log("add comment...", commentData);

  const ifReviewExist = await prisma.review.findUnique({
    where: {
      id: commentData.reviewId,
    },
  });
  //   console.log(ifReviewExist);

  if (!ifReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review Not found!");
  }

  const result = await prisma.comment.create({
    data: commentData,
  });
  return result;
};

const myComments = async (userId: string) => {
  // console.log('myComments....', userId);

  const result = await prisma.comment.findMany({
    where: {
      userId,
    },
    include: {
      review: {
        select: {
          title: true,
          excerp: true,
          description: true,
        },
      },
    },
  });
  return result;
};

const deleteComment = async (id: string) => {
  // console.log({ id });

  const isCommentExist = await prisma.comment.findUnique({
    where: {
      id,
    },
  });
  // console.log(isCommentExist);

  if (!isCommentExist) {
    throw new AppError(status.NOT_FOUND, "Comment not found!");
  }

  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CommentService = {
  addComment,
  myComments,
  deleteComment,
};
