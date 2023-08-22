"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_1 = __importDefault(require("./bad-request"));
describe("BadRequest class", () => {
    it("should set status and message correctly", () => {
        const message = "Bad Request";
        const badRequest = new bad_request_1.default(message);
        expect(badRequest.message).toBe(message);
        expect(badRequest.status).toBe(400);
        expect(badRequest instanceof bad_request_1.default).toBe(true); // Use instanceof
    });
    it("should inherit from CustomError", () => {
        const message = "Bad Request";
        const badRequest = new bad_request_1.default(message);
        expect(badRequest instanceof Error).toBe(true);
    });
});
