"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/Auth/auth.route");
const category_route_1 = require("../modules/Category/category.route");
const review_route_1 = require("../modules/Review/review.route");
const comment_route_1 = require("../modules/Comment/comment.route");
const vote_route_1 = require("../modules/Vote/vote.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const user_route_1 = require("../modules/User/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/review",
        route: review_route_1.ReviewRoutes,
    },
    {
        path: "/comment",
        route: comment_route_1.CommentRoutes,
    },
    {
        path: "/vote",
        route: vote_route_1.VoteRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserDataRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
