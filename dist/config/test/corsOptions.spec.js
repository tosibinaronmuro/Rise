"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = __importDefault(require("../allowedOrigins"));
const corsOptions_1 = __importDefault(require("../corsOptions"));
describe('corsOptions', () => {
    const mockCallback = jest.fn();
    it('should allow requests from allowed origins', () => {
        const allowedOrigin = allowedOrigins_1.default[0];
        corsOptions_1.default.origin(allowedOrigin, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, true);
    });
    it('should disallow requests from unallowed origins', () => {
        const unallowedOrigin = 'https://example.com';
        corsOptions_1.default.origin(unallowedOrigin, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(new Error('Not allowed by CORS'));
    });
});
