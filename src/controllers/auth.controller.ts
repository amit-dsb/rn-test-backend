import { Request, Response } from "express"
import { v4 as uuid_v4 } from 'uuid';
import { ERROR_CODES } from "../utils/handleErrorCode";
import { Users } from '../db/models'
import { encryptPassword, verifyPassword } from "../utils/handlePassword";
import { UserAttributes } from "../types/userTypes";
import { generateToken } from "../utils/handleToken";
import { Op } from "sequelize";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const login = async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.sendError(404, 'Please send email and password', ERROR_CODES.MISSING_FIELD);
        }

        if (!emailRegex.test(email)) {
            return res.sendError(404, 'Invalid email address', ERROR_CODES.INVALID_EMAIL);
        }

        let userData = await Users.findOne({
            where: {
                email
            }
        });
        if (!userData) {
            return res.sendError(404, 'User not found', ERROR_CODES.USER_NOT_FOUND);
        }
        const user = userData.get() as UserAttributes;

        let checkPassword = await verifyPassword(password, user.password);

        if (!checkPassword.verified) {
            return res.sendError(404, 'Password is invalid', ERROR_CODES.INVALID_PASSWORD);
        }

        let refreshToken = await generateToken(user.userId, "refreshToken");
        let accessToken = await generateToken(user.userId, "access");

        if (!refreshToken.success) {
            return res.sendError(500, `Error while generating refresh token: ${refreshToken.error}`, ERROR_CODES.TOKEN_GENERATION_FAILED);
        }

        if (!accessToken.success) {
            return res.sendError(500, `Error while generating access token: ${accessToken.error}`, ERROR_CODES.TOKEN_GENERATION_FAILED);
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
        }

        return res.sendSuccess(200, response);
    } catch (err) {
        return res.sendError(400, 'Some error occurred', ERROR_CODES.SERVER_ERROR);
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        let { img, email, password, firstName, lastName, dob, phone } = req.body;
        if (!img || !email || !password || !firstName || !lastName || !dob || !phone) {
            return res.sendError(404, 'Please send image, email, password, first name, last name, date of birth and phone number', ERROR_CODES.MISSING_FIELD);
        }

        if (!emailRegex.test(email)) {
            return res.sendError(404, 'Invalid email address', ERROR_CODES.INVALID_EMAIL);
        }

        let existingUser: any = await Users.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.sendError(404, 'User already registered with this email', ERROR_CODES.USER_ALREADY_EXISTS);
            }

            if (existingUser.phone === phone) {
                return res.sendError(404, 'Phone number is already registered', ERROR_CODES.PHONE_ALREADY_EXISTS);
            }
        }

        let securedPassword: any = await encryptPassword(password);
        if (!securedPassword) {
            return res.sendError(404, 'Password encryption failed', ERROR_CODES.PASSWORD_ENCRYPTION_FAILED);
        }

        const userId = await uuid_v4();
        let refreshToken: any = await generateToken(userId, "refreshToken");
        let accessToken: any = await generateToken(userId, "access");

        if (!refreshToken.success) {
            return res.sendError(500, `Error while generating refresh token: ${refreshToken.error}`, ERROR_CODES.TOKEN_GENERATION_FAILED);
        }

        if (!accessToken.success) {
            return res.sendError(500, `Error while generating access token: ${accessToken.error}`, ERROR_CODES.TOKEN_GENERATION_FAILED);
        }

        let createUser = await Users.create({
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
            return res.sendError(500, `Error while registering user`, ERROR_CODES.USER_REGISTERATION_FAILED);
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
        }

        return res.sendSuccess(200, response);
    } catch (err) {
        console.log(err, '=============')
        return res.sendError(400, 'Some error occurred', ERROR_CODES.SERVER_ERROR);
    }
}