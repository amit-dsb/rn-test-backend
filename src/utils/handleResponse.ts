import { NextFunction, Response, Request } from "express"

declare global {
    namespace Express {
        interface Response {
            sendSuccess: typeof sendSuccess;
            sendError: typeof sendError;
        }
    }
}

export const setInterface = (req: Request, res: Response, next: NextFunction) => {
    res.sendSuccess = sendSuccess.bind(res);
    res.sendError = sendError.bind(res);
    next();
}

const sendSuccess = function (this: Response, statusCode: number, data?: any, message?: string) {
    let responsePayload: any = {
        success: true
    }

    if (message) {
        responsePayload.message = message;
    }

    if (data) {
        responsePayload.data = data;
    }
    this.status(statusCode).json(responsePayload);
}

const sendError = function (this: Response, statusCode: number, error: any, errorCode: string) {
    this.status(statusCode).json({
        success: false,
        error,
        errorCode
    });
}