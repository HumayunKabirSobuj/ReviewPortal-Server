"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const RoleValidation_1 = __importDefault(require("../../middlewares/RoleValidation"));
const client_1 = require("@prisma/client");
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.get("/my-payments", (0, RoleValidation_1.default)(client_1.UserRole.USER), payment_controller_1.PaymentController.myPayments);
router.get("/admin-dashboard-info", (0, RoleValidation_1.default)(client_1.UserRole.ADMIN), payment_controller_1.PaymentController.adminDashboardInfo);
router.get("/user-dashboard-info", (0, RoleValidation_1.default)(client_1.UserRole.USER), payment_controller_1.PaymentController.userDashboardInfo);
router.post("/make-order/:id", (0, RoleValidation_1.default)(client_1.UserRole.USER), payment_controller_1.PaymentController.makeOrder);
router.post("/success", payment_controller_1.PaymentController.successOrder);
router.post("/failed", payment_controller_1.PaymentController.PaymentFailed);
exports.PaymentRoutes = router;
