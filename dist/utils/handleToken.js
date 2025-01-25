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
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env' });
const generateToken = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            userId
        };
        const secret = type === "refresh" ? process.env.JWT_SECRET_REFRESH : process.env.JWT_SECRET_ACCESS;
        const options = {
            expiresIn: type === "refresh" ? process.env.JWT_SECRET_REFRESH_EXP : process.env.JWT_SECRET_ACCESS_EXP
        };
        let token = yield jsonwebtoken_1.default.sign(payload, secret || "yJC_3M}&d=NQ$D(G52c:qY", options);
        return { token, success: true, };
    }
    catch (err) {
        return { error: err, success: false };
    }
});
exports.generateToken = generateToken;
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = type === "refresh" ? process.env.JWT_SECRET_REFRESH : process.env.JWT_SECRET_ACCESS;
        let decoded = yield jsonwebtoken_1.default.verify(token, secret || "yJC_3M}&d=NQ$D(G52c:qY");
        return { decoded, success: true, };
    }
    catch (err) {
        return { error: err, success: false };
    }
});
exports.verifyToken = verifyToken;
