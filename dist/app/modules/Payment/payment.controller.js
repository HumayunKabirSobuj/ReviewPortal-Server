"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const payment_service_1 = require("./payment.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const makeOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log(commentData);
    const { id } = req.params;
    yield payment_service_1.PaymentService.makeOrder(res, req.user.id, id);
}));
const successOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { reviewId } = req.params;
    console.log(req.query);
    const { userId, reviewId } = req.query;
    yield payment_service_1.PaymentService.successOrder(userId, reviewId);
    res.redirect(`https://review-portal-b4-02.vercel.app/payment-successful/${reviewId}`);
}));
const PaymentFailed = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.query;
    res.redirect(`https://review-portal-b4-02.vercel.app/payment-failed/${reviewId}`);
}));
const myPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.myPayments(req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Payments Fetched Successfuly.",
        data: result,
    });
}));
const adminDashboardInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.adminDashboardInfo();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Total Payments Fetched Successfuly.",
        data: result,
    });
}));
const userDashboardInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield payment_service_1.PaymentService.userDashboardInfo((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Dashbaord Info Fetched Successfuly.",
        data: result,
    });
}));
exports.PaymentController = {
    makeOrder,
    successOrder,
    PaymentFailed,
    myPayments,
    adminDashboardInfo,
    userDashboardInfo,
};
