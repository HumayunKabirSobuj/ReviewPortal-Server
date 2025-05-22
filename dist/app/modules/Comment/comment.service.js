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
exports.CommentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const addComment = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log("add comment...", commentData);
    const ifReviewExist = yield prisma_1.default.review.findUnique({
        where: {
            id: commentData.reviewId,
        },
    });
    //   console.log(ifReviewExist);
    if (!ifReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review Not found!");
    }
    const result = yield prisma_1.default.comment.create({
        data: commentData,
    });
    return result;
});
const myComments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('myComments....', userId);
    const result = yield prisma_1.default.comment.findMany({
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
const deleteComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ id });
    const isCommentExist = yield prisma_1.default.comment.findUnique({
        where: {
            id,
        },
    });
    // console.log(isCommentExist);
    if (!isCommentExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found!");
    }
    const result = yield prisma_1.default.comment.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.CommentService = {
    addComment,
    myComments,
    deleteComment,
};
