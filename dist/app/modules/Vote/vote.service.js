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
exports.VoteService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// const addVote = async (voteData: Vote) => {
//   // Step 1: Check if the review exists
//   const ifReviewExist = await prisma.review.findFirst({
//     where: {
//       id: voteData.reviewId,
//     },
//   });
//   if (!ifReviewExist) {
//     throw new AppError(status.NOT_FOUND, "Review Not found!");
//   }
//   // Step 2: Check if user already voted on this review
//   const existingVote = await prisma.vote.findFirst({
//     where: {
//       userId: voteData.userId,
//       reviewId: voteData.reviewId,
//     },
//   });
//   console.log(existingVote);
//   console.log(voteData);
//   if (voteData.type !== existingVote?.type) {
//     await prisma.vote.update({
//       where: {
//         id: existingVote?.id,
//       },
//       data: {
//         ...voteData,
//       },
//     });
//   }
//   if (voteData.type === existingVote?.type) {
//     await prisma.vote.delete({
//       where: {
//         id: existingVote?.id,
//       },
//     });
//   }
//   // if (existingVote) {
//   //   throw new AppError(status.CONFLICT, "You have already voted on this review!");
//   // }
//   // Step 3: Create the vote
//   const result = await prisma.vote.create({
//     data: {
//       ...voteData,
//     },
//   });
//   return result;
// };
const addVote = (voteData) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Check if the review exists
    const ifReviewExist = yield prisma_1.default.review.findFirst({
        where: {
            id: voteData.reviewId,
        },
    });
    if (!ifReviewExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Review Not found!");
    }
    // Step 2: Check if user already voted on this review
    const existingVote = yield prisma_1.default.vote.findFirst({
        where: {
            userId: voteData.userId,
            reviewId: voteData.reviewId,
        },
    });
    if (existingVote) {
        if (voteData.type === existingVote.type) {
            // Same type vote → remove vote
            yield prisma_1.default.vote.delete({
                where: { id: existingVote.id },
            });
            return { message: "Vote removed" };
        }
        else {
            // Different type vote → update vote
            const updatedVote = yield prisma_1.default.vote.update({
                where: { id: existingVote.id },
                data: { type: voteData.type },
            });
            return updatedVote;
        }
    }
    // Step 3: Create new vote if no previous vote exists
    const result = yield prisma_1.default.vote.create({
        data: Object.assign({}, voteData),
    });
    return result;
});
const myVotes = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('myComments....', userId);
    const result = yield prisma_1.default.vote.findMany({
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
exports.VoteService = {
    addVote,
    myVotes,
};
