import { Review } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../Errors/AppError";
import status from "http-status";
import { ReviewSearchableFields } from "../../constants/searchableFieldConstant";
import { paginationHelper } from "../../../helpers/paginationHelper";

const addReview = async (data: Review, userId: string) => {
  console.log("data", data);
  console.log("data", userId);

  const isCategoryExist = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
    },
  });

  //   console.log(isCategoryExist);

  if (!isCategoryExist) {
    throw new AppError(status.NOT_FOUND, "Category Not found!");
  }
  //   console.log(isCategoryExist);

  const reviewData = {
    ...data,
    userId,
  };
  //   console.log(reviewData);

  const result = await prisma.review.create({
    data: {
      ...reviewData,
    },
  });
  return result;
};

const getAllReview = async (params: any, options: any) => {
  const { limit, skip } = paginationHelper.calculatePagination(options);

  let andConditions: any[] = [];

  // Search Term filter
  if (params.searchTerm?.trim()) {
    andConditions.push({
      OR: ReviewSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Published / Unpublished
  // if (options.isPublished === "false") {
  //   andConditions.push({ isPublished: false });
  // } else {
  //   andConditions.push({ isPublished: true });
  // }

  // // Remove isPublished condition if empty string
  // if (options.isPublished === "") {
  //   andConditions = andConditions.filter(
  //     (condition) => !("isPublished" in condition)
  //   );
  // }
  if (options.isPublished === "false") {
    andConditions.push({ isPublished: false });
  } else if (options.isPublished === "true") {
    andConditions.push({ isPublished: true });
  }else{
    andConditions = andConditions.filter(
      (condition) => !("isPublished" in condition)
    );
  }

  // Remove isPublished condition if empty string


  // Premium / Free
  if (options.isPaid === "true") {
    andConditions.push({ isPremium: true });
  } else if (options.isPaid === "false") {
    andConditions.push({ isPremium: false });
  }else{
    andConditions = andConditions.filter(
      (condition) => !("isPremium" in condition)
    );
  }

  
  // Category filter
  if (options.categoryId?.trim()) {
    andConditions.push({ categoryId: options.categoryId });
  }

  const whereConditions = { AND: andConditions };

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profileUrl: true,
        },
      },
      category: true,
      comments: {
        select: {
          id: true,
          content: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileUrl: true,
            },
          },
        },
      },
      votes: {
        select: {
          id: true,
          type: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileUrl: true,
            },
          },
        },
      },
      Payment: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileUrl: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getSingleReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: {
      id,
    },

    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profileUrl: true,
        },
      },
      category: true,
      comments: {
        select: {
          id: true,
          content: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileUrl: true,
            },
          },
        },
      },
      Payment: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileUrl: true,
            },
          },
        },
      },
      votes: {
        select: {
          id: true,
          type: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profileUrl: true,
            },
          },
        },
      },
    },
  });

  const paymentCount = await prisma.payment.count({
    where: {
      reviewId: id,
    },
  });
  const totalComments = await prisma.comment.count({
    where: {
      reviewId: id,
    },
  });
  const totalDownVotes = await prisma.vote.count({
    where: {
      reviewId: id,
      type: "DOWN",
    },
  });
  const totalUpVotes = await prisma.vote.count({
    where: {
      reviewId: id,
      type: "UP",
    },
  });

  return {
    ...review,
    paymentCount,
    totalComments,
    totalUpVotes,
    totalDownVotes,
  };
};

const myselfAllReviews = async (userId: string) => {
  //  console.log('myselfAllReviews...',userId);

  const result = await prisma.review.findMany({
    where: {
      userId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profileUrl: true,
        },
      },
      category: true,
    },
  });
  return result;
};

const pendingReviews = async () => {
  const result = await prisma.review.findMany({
    where: {
      isPublished: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profileUrl: true,
        },
      },
      category: true,
    },
  });
  return result;
};

const makeReviewPublished = async (id: string) => {
  // console.log("makeReviewPublished...",id);

  const isReviewExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  // console.log(isReviewExist);

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found!");
  }

  if (isReviewExist.isPublished === true) {
    throw new Error("Already Published!");
  }

  const result = await prisma.review.update({
    where: {
      id,
    },
    data: {
      isPublished: true,
    },
  });
  return result;
};

const updateReview = async (
  userId: string,
  reviewId: string,
  updateData: Partial<Review>
) => {
  // console.log("updateReview....");
  // console.log({userId, reviewId});
  // console.log(updateData);
  const isReviewExist = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  // console.log(isReviewExist);

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review Not Found!");
  }

  const result = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: updateData,
  });

  return result;
};

const deleteReview = async (id: string) => {
  const isReviewExist = await prisma.review.findFirst({
    where: {
      id,
    },
  });

  // console.log(isReviewExist);

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review Not Found!");
  }

  const result = await prisma.review.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ReviewService = {
  addReview,
  getAllReview,
  getSingleReview,
  myselfAllReviews,
  pendingReviews,
  makeReviewPublished,
  updateReview,
  deleteReview,
};
