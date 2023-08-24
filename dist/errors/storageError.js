"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("./custom-error"));
class StorageError extends custom_error_1.default {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCodes = http_status_codes_1.StatusCodes.NOT_FOUND;
        Object.setPrototypeOf(this, StorageError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.default = StorageError;
