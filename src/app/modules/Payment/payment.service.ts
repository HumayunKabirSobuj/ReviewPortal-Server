import status from "http-status";
import prisma from "../../../shared/prisma";
import AppError from "../../Errors/AppError";
import SSLCommerzPayment from "sslcommerz-lts";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";
import { PaymentStatus } from "@prisma/client";

const makeOrder = async (res: Response, userId: string, reviewId: string) => {
  // console.log({ userId, reviewId });

  let total_amount;

  const isReviewExist = await prisma.review.findFirst({
    where: {
      id: reviewId,
        isPremium: true,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found!");
  }

  // console.log(isReviewExist);

  const isDiscountExist = await prisma.discount.findUnique({
    where: {
      reviewId: isReviewExist.id,
    },
  });

  // console.log(isDiscountExist);

  if (isDiscountExist) {
    total_amount = String(isDiscountExist.newPrice);
  } else {
    total_amount = String(isReviewExist.price);
  }

  const store_id = config.store_id as string;
  const store_passwd = config.store_pass as string;
  const is_live = false; //true for live, false for sandbox

  // console.log({store_id,store_passwd});

  const tran_id = uuidv4(); // ✅ tran_id generated using UUID
  //   console.log(tran_id);

  const data = {
    total_amount,
    currency: "BDT",
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `${config.backend_api_link}/api/payment/success?userId=${userId}&reviewId=${isReviewExist?.id}`,
    fail_url: `${config.backend_api_link}/api/payment/failed/?userId=${userId}&reviewId=${isReviewExist?.id}`,
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  try {
    const apiResponse: any = await sslcz.init(data); // Use await here
    // Redirect the user to payment gateway
    const GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });

    // console.log("Redirecting to: ", GatewayPageURL);
  } catch (error) {
    // console.error('Error occurred:', error);
    res.status(500).send({ error: "Something went wrong" });
  }
};

const successOrder = async (userId: string, reviewId: string) => {
  const isReviewExist = await prisma.review.findFirst({
    where: {
      id: reviewId,
    },
  });

  if (!isReviewExist) {
    throw new AppError(status.NOT_FOUND, "Review not found!");
  }

  const paymentData = {
    userId,
    reviewId,
    amount: Number(isReviewExist.price),
    status: PaymentStatus.SUCCESS,
  };
  //   console.log(paymentData);

  const isAlreadyPaid = await prisma.payment.findFirst({
    where: {
      userId,
      reviewId,
    },
  });

  if (isAlreadyPaid) {
    throw new Error("Already Paid");
  }

  await prisma.payment.create({
    data: paymentData,
  });
};

const myPayments = async (userId: string) => {
  // console.log("myPayments...", id);

  const result = await prisma.payment.findMany({
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

const adminDashboardInfo = async () => {
  // Aggregate total amount
  const totalAmount = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  // Count total number of payments
  const totalPayNumber = await prisma.payment.count();

  const totalUser = await prisma.user.count();
  const totalPublishedReviews = await prisma.review.count({
    where: {
      isPublished: true,
    },
  });
  const totalUnpublishedReviews = await prisma.review.count({
    where: {
      isPublished: false,
    },
  });

  const totalAmountPrice = totalAmount._sum.amount ?? 0;

  return {
    totalPaymentAmount: totalAmountPrice,
    totalPayments: totalPayNumber,
    totalUser,
    totalPublishedReviews,
    totalUnpublishedReviews,
  };
};
const userDashboardInfo = async (userId: string) => {
  // Aggregate total amount

  console.log(userId);
  const totalAmount = await prisma.payment.aggregate({
    where: {
      userId,
    },
    _sum: {
      amount: true,
    },
  });

  // Count total number of payments
  const totalPayNumber = await prisma.payment.count({
    where: {
      userId,
    },
  });

  const totalPublishedReviews = await prisma.review.count({
    where: {
      userId,
      isPublished: true,
    },
  });
  const totalUnpublishedReviews = await prisma.review.count({
    where: {
      userId,
      isPublished: false,
    },
  });

  const totalAmountPrice = totalAmount._sum.amount ?? 0;

  return {
    totalPaymentAmount: totalAmountPrice,
    totalPayments: totalPayNumber,
    totalPublishedReviews,
    totalUnpublishedReviews,
  };
};

export const PaymentService = {
  makeOrder,
  successOrder,
  myPayments,
  adminDashboardInfo,
  userDashboardInfo,
};
