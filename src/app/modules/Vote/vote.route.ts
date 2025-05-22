import express from "express";
import RoleValidation from "../../middlewares/RoleValidation";
import { UserRole } from "@prisma/client";
import { VoteController } from "./vote.controller";
const router = express.Router();

router.get(
  "/my-votes",
  RoleValidation(UserRole.ADMIN, UserRole.USER),
  VoteController.myVotes
);

router.post(
  "/create-vote",
  RoleValidation(UserRole.ADMIN, UserRole.USER),
  VoteController.addVote
);

export const VoteRoutes = router;
