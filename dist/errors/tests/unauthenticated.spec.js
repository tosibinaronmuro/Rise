"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unauthenticated_1 = __importDefault(require("../unauthenticated"));
const http_status_codes_1 = require("http-status-codes");
describe("unauthenticated class", () => {
    it("should set status and message correctly", () => {
        const message = "please provide token";
        const unauthenticated = new unauthenticated_1.default(message);
        expect(unauthenticated.message).toBe(message);
        expect(unauthenticated.status).toBe(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    });
    it("should inherit from CustomError", () => {
        const message = "Unauthenticated";
        const badRequest = new unauthenticated_1.default(message);
        expect(badRequest instanceof Error).toBe(true);
    });
});
