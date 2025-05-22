"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const client_1 = require("@prisma/client");
const RoleValidation_1 = __importDefault(require("../../middlewares/RoleValidation"));
const router = express_1.default.Router();
router.get("/", category_controller_1.CategoryController.getAllCategory);
router.get("/:id", category_controller_1.CategoryController.getSingleCategory);
router.post("/create-category", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), category_controller_1.CategoryController.createCategory);
exports.CategoryRoutes = router;
