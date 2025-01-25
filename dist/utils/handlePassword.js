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
exports.encryptPassword = encryptPassword;
exports.verifyPassword = verifyPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env' });
function encryptPassword(password) {
    try {
        let saltRound = process.env.SALT_ROUND;
        let salt = bcryptjs_1.default.genSaltSync(Number(saltRound));
        let securedPassword = bcryptjs_1.default.hashSync(password, salt);
        return { password: securedPassword, success: true };
    }
    catch (err) {
        return { error: err, success: false };
    }
}
function verifyPassword(filledPassword, dbPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let comparePassword = yield bcryptjs_1.default.compare(filledPassword, dbPassword);
            return { verified: comparePassword, success: true };
        }
        catch (err) {
            return { error: err, success: false };
        }
    });
}
