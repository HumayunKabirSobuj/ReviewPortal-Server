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
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const searchableFieldConstant_1 = require("../../constants/searchableFieldConstant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const addReview = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data", data);
    console.log("data", userId);
    const isCategoryExist = yield prisma_1.default.category.findFirst({
        where: {
            id: data.categoryId,
        },
    });
    //   console.log(isCategoryExist);
    if (!isCategoryExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category Not found!");
    }
    //   console.log(isCategoryExist);
    const reviewData = Object.assign(Object.assign({}, data), { userId });
    //   console.log(reviewData);
    const result = yield prisma_1.default.review.create({
        data: Object.assign({}, reviewData),
    });
    return result;
});
const getAllReview = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    let andConditions = [];
    // Search Term filter
    if ((_a = params.searchTerm) === null || _a === void 0 ? void 0 : _a.trim()) {
        andConditions.push({
            OR: searchableFieldConstant_1.ReviewSearchableFields.map((field) => ({
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
    }
    else if (options.isPublished === "true") {
        andConditions.push({ isPublished: true });
    }
    else {
        andConditions = andConditions.filter((condition) => !("isPublished" in condition));
    }
    // Remove isPublished condition if empty string
    // Premium / Free
    if (options.isPaid === "true") {
        andConditions.push({ isPremium: true });
    }
    else if (options.isPaid === "false") {
        andConditions.push({ isPremium: false });
    }
    else {
        andConditions = andConditions.filter((condition) => !("isPremium" in condition));
    }
    // Category filter
    if ((_b = options.categoryId) === null || _b === void 0 ? void 0 : _b.trim()) {
        andConditions.push({ categoryId: options.categoryId });
    }
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.review.findMany({
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
            Discount: true,
        },
    });
    return result;
});
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
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
            Discount: true,
        },
    });
    const paymentCount = yield prisma_1.default.payment.count({
        where: {
            reviewId: id,
        },
    });
    const totalComments = yield prisma_1.default.comment.count({
        where: {
            reviewId: id,
        },
    });
    const totalDownVotes = yield prisma_1.default.vote.count({
        where: {
            reviewId: id,
            type: "DOWN",
        },
    });
    const totalUpVotes = yield prisma_1.default.vote.count({
        where: {
            reviewId: id,
            type: "UP",
        },
    });
    return Object.assign(Object.assign({}, review), { paymentCount,
        totalComments,
        totalUpVotes,
        totalDownVotes });
});
const myselfAllReviews = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //  console.log('myselfAllReviews...',userId);
    const result = yield prisma_1.default.review.findMany({
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
});
const pendingReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany({
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
});
const makeReviewPublished = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("makeReviewPublished...",id);
    const isReviewExist = yield prisma_1.default.review.findUnique({
        where: {
            id,
        },
    });
    // console.log(isReviewExist);
    if (!isReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found!");
    }
    if (isReviewExist.isPublished === true) {
        throw new Error("Already Published!");
    }
    const result = yield prisma_1.default.review.update({
        where: {
            id,
        },
        data: {
            isPublished: true,
        },
    });
    return result;
});
const updateReview = (userId, reviewId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("updateReview....");
    // console.log({userId, reviewId});
    // console.log(updateData);
    const isReviewExist = yield prisma_1.default.review.findFirst({
        where: {
            id: reviewId,
            userId,
        },
    });
    // console.log(isReviewExist);
    if (!isReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review Not Found!");
    }
    const result = yield prisma_1.default.review.update({
        where: {
            id: reviewId,
        },
        data: updateData,
    });
    return result;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isReviewExist = yield prisma_1.default.review.findFirst({
        where: {
            id,
        },
    });
    // console.log(isReviewExist);
    if (!isReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review Not Found!");
    }
    const result = yield prisma_1.default.review.delete({
        where: {
            id,
        },
    });
    return result;
});
// const discountReview = async (userId: string, data: Discount) => {
//   const PremiumReviews = await prisma.review.findMany({
//     where: {
//       userId,
//       isPremium: true,
//       isPublished: true,
//     },
//   });
//   const isReviewFind = PremiumReviews.find(
//     (review: Review) => review.id === data.reviewId
//   );
//   if (!isReviewFind) {
//     throw new AppError(status.NOT_FOUND, "Review not found!");
//   }
//   const disCountData = {
//     ...data,
//     newPrice:
//       (isReviewFind.price as number) -
//       ((isReviewFind.price as number) * data.percent) / 100,
//   };
//   // console.log(disCountData);
//   const isDiscountAlreadyExist = await prisma.discount.findUnique({
//     where: {
//       reviewId: data.reviewId,
//     },
//   });
//   // console.log(isDiscountAlreadyExist);
//   if (isDiscountAlreadyExist) {
//     throw new AppError(500, "Discount Already Exist");
//   }
//   const result = await prisma.discount.create({
//     data: disCountData,
//   });
//   return result;
// };
const discountReview = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const PremiumReviews = yield tx.review.findMany({
            where: {
                userId,
                isPremium: true,
                isPublished: true,
            },
        });
        // console.log(PremiumReviews);
        const isReviewFind = PremiumReviews.find((review) => review.id === data.reviewId);
        if (!isReviewFind) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review not found!");
        }
        const isDiscountAlreadyExist = yield tx.discount.findUnique({
            where: {
                reviewId: data.reviewId,
            },
        });
        if (isDiscountAlreadyExist) {
            throw new AppError_1.default(500, "Discount Already Exist");
        }
        const disCountData = Object.assign(Object.assign({}, data), { newPrice: isReviewFind.price -
                (isReviewFind.price * data.percent) / 100 });
        const result = yield tx.discount.create({
            data: disCountData,
        });
        return result;
    }));
});
exports.ReviewService = {
    addReview,
    getAllReview,
    getSingleReview,
    myselfAllReviews,
    pendingReviews,
    makeReviewPublished,
    updateReview,
    deleteReview,
    discountReview,
};
