import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request } from "express";
import { VoteService } from "./vote.service";

const addVote = catchAsync(async (req: Request & { user?: any }, res) => {
  //   console.log(req.body);
//   console.log(req.user);
  const voteData = {
    ...req.body,
    userId:req.user.id
  }

//   console.log(commentData);
  const result = await VoteService.addVote(voteData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Vote Added Successfuly.",
    data: result,
  });
});
const myVotes = catchAsync(async (req: Request & { user?: any }, res) => {


  const result = await VoteService.myVotes(req.user.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "My Votes Fetched Successfuly.",
    data: result,
  });
});

export const VoteController = {
    addVote,
    myVotes
};
