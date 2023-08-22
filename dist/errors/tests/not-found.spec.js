"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_1 = __importDefault(require("../not-found"));
const http_status_codes_1 = require("http-status-codes");
describe("NotFound class", () => {
    it("should set status and message correctly", () => {
        const message = "Resource not found";
        const notFound = new not_found_1.default(message);
        expect(notFound.message).toBe(message);
        expect(notFound.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
    });
    it("should inherit from CustomError", () => {
        const message = "Not Found";
        const badRequest = new not_found_1.default(message);
        expect(badRequest instanceof Error).toBe(true);
    });
});
