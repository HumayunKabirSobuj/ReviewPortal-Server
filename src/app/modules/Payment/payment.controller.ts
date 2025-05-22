import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import { Request } from "express";
import config from "../../../config";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const makeOrder = catchAsync(async (req: Request & { user?: any }, res) => {
  //   console.log(commentData);
  const { id } = req.params;
  await PaymentService.makeOrder(res, req.user.id, id);
});
const successOrder = catchAsync(async (req: Request & { user?: any }, res) => {
  // const { reviewId } = req.params;
  console.log(req.query);
  const { userId, reviewId } = req.query;
  await PaymentService.successOrder(userId as string, reviewId as string);
  res.redirect(
    `https://review-portal-b4-02.vercel.app/payment-successful/${reviewId}`
  );
});

const PaymentFailed = catchAsync(async (req, res) => {
  const { reviewId } = req.query;
  res.redirect(
    `https://review-portal-b4-02.vercel.app/payment-failed/${reviewId}`
  );
});

const myPayments = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await PaymentService.myPayments(req.user.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "My Payments Fetched Successfuly.",
    data: result,
  });
});
const adminDashboardInfo = catchAsync(async (req, res) => {
  const result = await PaymentService.adminDashboardInfo();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Total Payments Fetched Successfuly.",
    data: result,
  });
});
const userDashboardInfo = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await PaymentService.userDashboardInfo(req?.user?.id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Dashbaord Info Fetched Successfuly.",
      data: result,
    });
  }
);
export const PaymentController = {
  makeOrder,
  successOrder,
  PaymentFailed,
  myPayments,
  adminDashboardInfo,
  userDashboardInfo,
};
