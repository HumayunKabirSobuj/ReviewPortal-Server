import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";
import { Request } from "express";

const addReview = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await ReviewService.addReview(req.body, req.user.id);

  //   console.log(req.user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review Added Successfuly.",
    data: result,
  });
});
const getAllReview = catchAsync(async (req, res) => {
  // console.log(req.query);
  const { searchTerm, ...options } = req.query;
  // console.log(options);
  const result = await ReviewService.getAllReview(req.query, options);

  //   console.log(req.user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All Review Fetched Successfuly.",
    data: result,
  });
});
const getSingleReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewService.getSingleReview(id);

  //   console.log(req.user);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Single Review Fetched Successfuly.",
    data: result,
  });
});
const myselfAllReviews = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await ReviewService.myselfAllReviews(req.user.id);

    //   console.log(req.user);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Myself All Review Fetched Successfuly.",
      data: result,
    });
  }
);
const pendingReviews = catchAsync(async (req, res) => {
  const result = await ReviewService.pendingReviews();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Pending Reviews Fetched Successfuly.",
    data: result,
  });
});
const makeReviewPublished = catchAsync(async (req, res) => {
  // console.log(req.params);
  const { id } = req.params;
  const result = await ReviewService.makeReviewPublished(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review Published Successfuly.",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request & { user?: any }, res) => {
  const { id } = req.params;

  const result = await ReviewService.updateReview(req.user.id, id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reviews Updated Successfuly.",
    data: result,
  });
});
const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ReviewService.deleteReview(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reviews Deleted Successfuly.",
    data: result,
  });
});
const discountReview = catchAsync(async (req:Request & { user?: any }, res) => {
  const result = await ReviewService.discountReview(req.user.id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Discount Added Successfuly.",
    data: result,
  });
});
export const reviewController = {
  addReview,
  getAllReview,
  getSingleReview,
  myselfAllReviews,
  pendingReviews,
  makeReviewPublished,
  updateReview,
  deleteReview,
  discountReview
};
