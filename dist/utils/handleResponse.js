"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInterface = void 0;
const setInterface = (req, res, next) => {
    res.sendSuccess = sendSuccess.bind(res);
    res.sendError = sendError.bind(res);
    next();
};
exports.setInterface = setInterface;
const sendSuccess = function (statusCode, data, message) {
    let responsePayload = {
        success: true
    };
    if (message) {
        responsePayload.message = message;
    }
    if (data) {
        responsePayload.data = data;
    }
    this.status(statusCode).json(responsePayload);
};
const sendError = function (statusCode, error, errorCode) {
    this.status(statusCode).json({
        success: false,
        error,
        errorCode
    });
};
