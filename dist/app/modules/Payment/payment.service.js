"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../../config"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const makeOrder = (res, userId, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ userId, reviewId });
    let total_amount;
    const isReviewExist = yield prisma_1.default.review.findFirst({
        where: {
            id: reviewId,
            isPremium: true,
        },
    });
    if (!isReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found!");
    }
    // console.log(isReviewExist);
    const isDiscountExist = yield prisma_1.default.discount.findUnique({
        where: {
            reviewId: isReviewExist.id,
        },
    });
    // console.log(isDiscountExist);
    if (isDiscountExist) {
        total_amount = String(isDiscountExist.newPrice);
    }
    else {
        total_amount = String(isReviewExist.price);
    }
    const store_id = config_1.default.store_id;
    const store_passwd = config_1.default.store_pass;
    const is_live = false; //true for live, false for sandbox
    // console.log({store_id,store_passwd});
    const tran_id = (0, uuid_1.v4)(); // ✅ tran_id generated using UUID
    //   console.log(tran_id);
    const data = {
        total_amount,
        currency: "BDT",
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `${config_1.default.backend_api_link}/api/payment/success?userId=${userId}&reviewId=${isReviewExist === null || isReviewExist === void 0 ? void 0 : isReviewExist.id}`,
        fail_url: `${config_1.default.backend_api_link}/api/payment/failed/?userId=${userId}&reviewId=${isReviewExist === null || isReviewExist === void 0 ? void 0 : isReviewExist.id}`,
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
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    try {
        const apiResponse = yield sslcz.init(data); // Use await here
        // Redirect the user to payment gateway
        const GatewayPageURL = apiResponse.GatewayPageURL;
        res.send({ url: GatewayPageURL });
        // console.log("Redirecting to: ", GatewayPageURL);
    }
    catch (error) {
        // console.error('Error occurred:', error);
        res.status(500).send({ error: "Something went wrong" });
    }
});
const successOrder = (userId, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const isReviewExist = yield prisma_1.default.review.findFirst({
        where: {
            id: reviewId,
        },
    });
    if (!isReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found!");
    }
    const paymentData = {
        userId,
        reviewId,
        amount: Number(isReviewExist.price),
        status: client_1.PaymentStatus.SUCCESS,
    };
    //   console.log(paymentData);
    const isAlreadyPaid = yield prisma_1.default.payment.findFirst({
        where: {
            userId,
            reviewId,
        },
    });
    if (isAlreadyPaid) {
        throw new Error("Already Paid");
    }
    yield prisma_1.default.payment.create({
        data: paymentData,
    });
});
const myPayments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("myPayments...", id);
    const result = yield prisma_1.default.payment.findMany({
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
});
const adminDashboardInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Aggregate total amount
    const totalAmount = yield prisma_1.default.payment.aggregate({
        _sum: {
            amount: true,
        },
    });
    // Count total number of payments
    const totalPayNumber = yield prisma_1.default.payment.count();
    const totalUser = yield prisma_1.default.user.count();
    const totalPublishedReviews = yield prisma_1.default.review.count({
        where: {
            isPublished: true,
        },
    });
    const totalUnpublishedReviews = yield prisma_1.default.review.count({
        where: {
            isPublished: false,
        },
    });
    const totalAmountPrice = (_a = totalAmount._sum.amount) !== null && _a !== void 0 ? _a : 0;
    return {
        totalPaymentAmount: totalAmountPrice,
        totalPayments: totalPayNumber,
        totalUser,
        totalPublishedReviews,
        totalUnpublishedReviews,
    };
});
const userDashboardInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Aggregate total amount
    var _a;
    console.log(userId);
    const totalAmount = yield prisma_1.default.payment.aggregate({
        where: {
            userId,
        },
        _sum: {
            amount: true,
        },
    });
    // Count total number of payments
    const totalPayNumber = yield prisma_1.default.payment.count({
        where: {
            userId,
        },
    });
    const totalPublishedReviews = yield prisma_1.default.review.count({
        where: {
            userId,
            isPublished: true,
        },
    });
    const totalUnpublishedReviews = yield prisma_1.default.review.count({
        where: {
            userId,
            isPublished: false,
        },
    });
    const totalAmountPrice = (_a = totalAmount._sum.amount) !== null && _a !== void 0 ? _a : 0;
    return {
        totalPaymentAmount: totalAmountPrice,
        totalPayments: totalPayNumber,
        totalPublishedReviews,
        totalUnpublishedReviews,
    };
});
exports.PaymentService = {
    makeOrder,
    successOrder,
    myPayments,
    adminDashboardInfo,
    userDashboardInfo,
};
