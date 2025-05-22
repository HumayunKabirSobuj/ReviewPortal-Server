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
exports.UserDataServices = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const searchableFieldConstant_1 = require("../../constants/searchableFieldConstant");
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const getAllUsers = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    let andConditions = [];
    // Search Term filter
    if ((_a = params.searchTerm) === null || _a === void 0 ? void 0 : _a.trim()) {
        andConditions.push({
            OR: searchableFieldConstant_1.UserSearchableFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (options.role === "USER") {
        andConditions.push({ role: client_1.UserRole.USER });
    }
    else if (options.role === "ADMIN") {
        andConditions.push({ role: client_1.UserRole.ADMIN });
    }
    else {
        andConditions = andConditions.filter((condition) => !("role" in condition));
    }
    if (options.status === "ACTIVE") {
        andConditions.push({ status: client_1.UserStatus.ACTIVE });
    }
    else if (options.status === "BLOCKED") {
        andConditions.push({ status: client_1.UserStatus.BLOCKED });
    }
    else {
        andConditions = andConditions.filter((condition) => !("status" in condition));
    }
    const whereConditions = { AND: andConditions };
    // console.log("get.....");
    const result = prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            profileUrl: true,
        },
    });
    return result;
});
const makeUserToAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            role: client_1.UserRole.ADMIN,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            profileUrl: true,
        },
    });
    return result;
});
const makeAdminToUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            role: client_1.UserRole.USER,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            profileUrl: true,
        },
    });
    return result;
});
const blockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status: client_1.UserStatus.BLOCKED,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            profileUrl: true,
        },
    });
    return result;
});
const makeActive = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            profileUrl: true,
        },
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const result = yield prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.UserDataServices = {
    getAllUsers,
    makeUserToAdmin,
    makeAdminToUser,
    blockUser,
    makeActive,
    deleteUser,
};
