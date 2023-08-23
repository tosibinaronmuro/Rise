"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../../errors/index");
const auth_1 = __importDefault(require("../auth"));
const secretKey = process.env.JWT_SECRET || "";
jest.mock('jsonwebtoken');
describe('authMiddleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeEach(() => {
        mockReq = {};
        mockRes = {};
        mockNext = jest.fn();
    });
    it('should throw Unauthenticated error if no authorization header', () => {
        mockReq.headers = {};
        expect(() => (0, auth_1.default)(mockReq, mockRes, mockNext)).toThrow(index_1.Unauthenticated);
        expect(mockNext).not.toHaveBeenCalled();
    });
    it('should throw Unauthenticated error if authorization header does not start with Bearer', () => {
        mockReq.headers = { authorization: 'InvalidHeader' };
        expect(() => (0, auth_1.default)(mockReq, mockRes, mockNext)).toThrow(index_1.Unauthenticated);
        expect(mockNext).not.toHaveBeenCalled();
    });
    it('should throw Unauthenticated error if token is missing', () => {
        mockReq.headers = { authorization: 'Bearer' };
        expect(() => (0, auth_1.default)(mockReq, mockRes, mockNext)).toThrow(index_1.Unauthenticated);
        expect(mockNext).not.toHaveBeenCalled();
    });
    it('should call next if token is valid', () => {
        const mockPayload = { userId: '123', name: 'John' };
        const mockToken = 'validToken';
        mockReq.headers = { authorization: `Bearer ${mockToken}` };
        jsonwebtoken_1.default.verify = jest.fn().mockReturnValue(mockPayload);
        (0, auth_1.default)(mockReq, mockRes, mockNext);
        expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(mockToken, secretKey);
        expect(mockReq.user).toEqual(mockPayload);
        expect(mockNext).toHaveBeenCalled();
    });
    it('should throw Unauthenticated error if jwt.verify throws an error', () => {
        mockReq.headers = { authorization: 'Bearer invalidToken' };
        jsonwebtoken_1.default.verify = jest.fn().mockImplementation(() => {
            throw new Error('Invalid token');
        });
        expect(() => (0, auth_1.default)(mockReq, mockRes, mockNext)).toThrow(index_1.Unauthenticated);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
