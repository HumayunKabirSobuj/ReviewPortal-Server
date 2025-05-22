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
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log("createCategory...",data);
    const isCategoryExist = yield prisma_1.default.category.findUnique({
        where: {
            name: data.name,
        },
    });
    if (isCategoryExist) {
        throw new Error("Category Already Exist");
    }
    const result = yield prisma_1.default.category.create({
        data,
    });
    return result;
});
const getAllCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany();
    return result;
});
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExist = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!isCategoryExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not exist..");
    }
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
        include: {
            reviews: true,
        },
    });
    return result;
});
exports.CategoryService = {
    createCategory,
    getAllCategory,
    getSingleCategory,
};
