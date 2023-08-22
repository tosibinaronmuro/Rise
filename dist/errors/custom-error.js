"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, statusCode, keyValue, errors) {
        super(message);
        this.statusCode = statusCode;
        this.keyValue = keyValue;
        this.errors = errors;
    }
}
exports.default = CustomError;
