"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const RoleValidation_1 = __importDefault(require("../../middlewares/RoleValidation"));
const client_1 = require("@prisma/client");
const comment_controller_1 = require("./comment.controller");
const router = express_1.default.Router();
router.get("/my-comments", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), comment_controller_1.CommentController.myComments);
router.delete("/delete-comment/:id", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), comment_controller_1.CommentController.deleteComment);
router.post("/create-comment", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), comment_controller_1.CommentController.addComment);
exports.CommentRoutes = router;
