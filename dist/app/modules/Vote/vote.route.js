"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const RoleValidation_1 = __importDefault(require("../../middlewares/RoleValidation"));
const client_1 = require("@prisma/client");
const vote_controller_1 = require("./vote.controller");
const router = express_1.default.Router();
router.get("/my-votes", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), vote_controller_1.VoteController.myVotes);
router.post("/create-vote", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), vote_controller_1.VoteController.addVote);
exports.VoteRoutes = router;
