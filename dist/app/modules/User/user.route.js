"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const RoleValidation_1 = __importDefault(require("../../middlewares/RoleValidation"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/all-users", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserDataController.getAllUsers);
router.patch("/make-admin/:id", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserDataController.makeUserToAdmin);
router.patch("/make-user/:id", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserDataController.makeAdminToUser);
router.patch("/block-user/:id", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserDataController.blockUser);
router.patch("/make-user-active/:id", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserDataController.makeActive);
router.delete("/delete-user/:id", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserDataController.deleteUser);
exports.UserDataRoutes = router;
