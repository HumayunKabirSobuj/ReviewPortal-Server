import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { ReviewRoutes } from "../modules/Review/review.route";
import { CommentRoutes } from "../modules/Comment/comment.route";
import { VoteRoutes } from "../modules/Vote/vote.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { UserDataRoutes } from "../modules/User/user.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },
  {
    path: "/vote",
    route: VoteRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/users",
    route: UserDataRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
