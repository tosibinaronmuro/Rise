"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_1 = __importDefault(require("../bad-request"));
const http_status_codes_1 = require("http-status-codes");
describe("BadRequest class", () => {
    it("should set status and message correctly", () => {
        const message = "Bad Request";
        const badRequest = new bad_request_1.default(message);
        expect(badRequest.message).toBe(message);
        expect(badRequest.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(badRequest instanceof bad_request_1.default).toBe(true);
    });
    it("should inherit from CustomError", () => {
        const message = "Bad Request";
        const badRequest = new bad_request_1.default(message);
        expect(badRequest instanceof Error).toBe(true);
    });
});
