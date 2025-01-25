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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const uuid_1 = require("uuid");
const handleErrorCode_1 = require("../utils/handleErrorCode");
const models_1 = require("../db/models");
const handlePassword_1 = require("../utils/handlePassword");
const handleToken_1 = require("../utils/handleToken");
const sequelize_1 = require("sequelize");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.sendError(404, 'Please send email and password', handleErrorCode_1.ERROR_CODES.MISSING_FIELD);
        }
        if (!emailRegex.test(email)) {
            return res.sendError(404, 'Invalid email address', handleErrorCode_1.ERROR_CODES.INVALID_EMAIL);
        }
        let userData = yield models_1.Users.findOne({
            where: {
                email
            }
        });
        if (!userData) {
            return res.sendError(404, 'User not found', handleErrorCode_1.ERROR_CODES.USER_NOT_FOUND);
        }
        const user = userData.get();
        let checkPassword = yield (0, handlePassword_1.verifyPassword)(password, user.password);
        if (!checkPassword.verified) {
            return res.sendError(404, 'Password is invalid', handleErrorCode_1.ERROR_CODES.INVALID_PASSWORD);
        }
        let refreshToken = yield (0, handleToken_1.generateToken)(user.userId, "refreshToken");
        let accessToken = yield (0, handleToken_1.generateToken)(user.userId, "access");
        if (!refreshToken.success) {
            return res.sendError(500, `Error while generating refresh token: ${refreshToken.error}`, handleErrorCode_1.ERROR_CODES.TOKEN_GENERATION_FAILED);
        }
        if (!accessToken.success) {
            return res.sendError(500, `Error while generating access token: ${accessToken.error}`, handleErrorCode_1.ERROR_CODES.TOKEN_GENERATION_FAILED);
        }
        let response = {
            userId: user.userId,
            email: user.email,
            img: user.img,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dob: user.dob,
            accessToken: accessToken.token,
        };
        return res.sendSuccess(200, response);
    }
    catch (err) {
        return res.sendError(400, 'Some error occurred', handleErrorCode_1.ERROR_CODES.SERVER_ERROR);
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { img, email, password, firstName, lastName, dob, phone } = req.body;
        if (!img || !email || !password || !firstName || !lastName || !dob || !phone) {
            return res.sendError(404, 'Please send image, email, password, first name, last name, date of birth and phone number', handleErrorCode_1.ERROR_CODES.MISSING_FIELD);
        }
        if (!emailRegex.test(email)) {
            return res.sendError(404, 'Invalid email address', handleErrorCode_1.ERROR_CODES.INVALID_EMAIL);
        }
        let existingUser = yield models_1.Users.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email },
                    { phone }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.sendError(404, 'User already registered with this email', handleErrorCode_1.ERROR_CODES.USER_ALREADY_EXISTS);
            }
            if (existingUser.phone === phone) {
                return res.sendError(404, 'Phone number is already registered', handleErrorCode_1.ERROR_CODES.PHONE_ALREADY_EXISTS);
            }
        }
        let securedPassword = yield (0, handlePassword_1.encryptPassword)(password);
        if (!securedPassword) {
            return res.sendError(404, 'Password encryption failed', handleErrorCode_1.ERROR_CODES.PASSWORD_ENCRYPTION_FAILED);
        }
        const userId = yield (0, uuid_1.v4)();
        let refreshToken = yield (0, handleToken_1.generateToken)(userId, "refreshToken");
        let accessToken = yield (0, handleToken_1.generateToken)(userId, "access");
        if (!refreshToken.success) {
            return res.sendError(500, `Error while generating refresh token: ${refreshToken.error}`, handleErrorCode_1.ERROR_CODES.TOKEN_GENERATION_FAILED);
        }
        if (!accessToken.success) {
            return res.sendError(500, `Error while generating access token: ${accessToken.error}`, handleErrorCode_1.ERROR_CODES.TOKEN_GENERATION_FAILED);
        }
        let createUser = yield models_1.Users.create({
            userId,
            email,
            password: securedPassword.password,
            img,
            firstName,
            lastName,
            phone,
            dob,
            refreshToken: refreshToken.token,
        });
        if (!createUser) {
            return res.sendError(500, `Error while registering user`, handleErrorCode_1.ERROR_CODES.USER_REGISTERATION_FAILED);
        }
        let response = {
            userId: userId,
            email,
            img,
            firstName,
            lastName,
            phone,
            dob,
            accessToken: accessToken.token,
        };
        return res.sendSuccess(200, response);
    }
    catch (err) {
        console.log(err, '=============');
        return res.sendError(400, 'Some error occurred', handleErrorCode_1.ERROR_CODES.SERVER_ERROR);
    }
});
exports.register = register;
