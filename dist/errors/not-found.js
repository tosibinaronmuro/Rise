"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const custom_error_1 = __importDefault(require("./custom-error"));
const http_status_codes_1 = require("http-status-codes");
class NotFound extends custom_error_1.default {
    constructor(message) {
        super(message);
        this.status = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
module.exports = NotFound;
