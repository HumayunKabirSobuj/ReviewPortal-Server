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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
// import { Secret } from "jsonwebtoken";
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(payload);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    // console.log(isUserExist);
    if (isUserExist) {
        throw new Error("User Already Exist");
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.password, 12);
    // console.log(hashPassword);
    const userData = Object.assign(Object.assign({}, payload), { password: hashPassword });
    const result = yield prisma_1.default.user.create({
        data: Object.assign({}, userData),
        select: {
            id: true,
            name: true,
            email: true,
            profileUrl: true,
            role: true,
            status: true,
        },
    });
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    console.log(userData);
    if (!userData) {
        throw new Error("User not found..");
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    // console.log(isCorrectPassword);
    if (!isCorrectPassword) {
        throw new Error("Your Password is incorrect..");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        name: userData.name,
        profileUrl: userData.profileUrl,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.UserService = {
    createUser,
    loginUser,
};
