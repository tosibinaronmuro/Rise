"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("../errors/custom-error"));
const errorHandler = (err, req, res, next) => {
    let customError = {
        msg: err.message || 'Something went wrong, please try again later',
    };
    if (err instanceof custom_error_1.default) {
        customError.msg = err.message;
        customError.statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
        if (err.keyValue) {
            customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
            customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        }
        if (err.errors) {
            customError.msg = err.errors
                .map((item) => item.message)
                .join(',');
            customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        }
    }
    if (err.name === 'CastError') {
        customError.msg = `No item found with id `;
        customError.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
    return res.status(customError.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: customError.msg });
};
exports.default = errorHandler;
