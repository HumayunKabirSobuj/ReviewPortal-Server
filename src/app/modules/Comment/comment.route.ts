import express from "express";
import RoleValidation from "../../middlewares/RoleValidation";
import { UserRole } from "@prisma/client";
import { CommentController } from "./comment.controller";
const router = express.Router();

router.get(
  "/my-comments",
  RoleValidation(UserRole.ADMIN, UserRole.USER),
  CommentController.myComments
);

router.delete(
  "/delete-comment/:id",
  RoleValidation(UserRole.ADMIN, UserRole.USER),
  CommentController.deleteComment
);

router.post(
  "/create-comment",
  RoleValidation(UserRole.ADMIN, UserRole.USER),
  CommentController.addComment
);


export const CommentRoutes = router;
