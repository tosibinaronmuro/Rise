"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const errors_handler_1 = __importDefault(require("../errors-handler"));
const custom_error_1 = __importDefault(require("../../errors/custom-error"));
describe('errorHandler', () => {
    const app = (0, express_1.default)();
    app.use(errors_handler_1.default);
    it('should handle CustomError instances', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = 'Custom error message';
        const customError = new custom_error_1.default(errorMessage);
        const response = yield (0, supertest_1.default)(app).post('/custom-error').send(customError);
        expect(response.status).toBe(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body.msg).toBe(errorMessage);
    }));
    it('should handle ValidationError', () => __awaiter(void 0, void 0, void 0, function* () {
        const validationErrors = [
            { message: 'Validation error 1' },
            { message: 'Validation error 2' },
        ];
        const validationError = { name: 'ValidationError', errors: validationErrors };
        const response = yield (0, supertest_1.default)(app).post('/validation-error').send(validationError);
        expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        // Add assertions for the specific error messages
    }));
    it('should handle duplicate value error', () => __awaiter(void 0, void 0, void 0, function* () {
        const duplicateError = {
            code: 11000,
            keyValue: { fieldName: 'value' },
        };
        const response = yield (0, supertest_1.default)(app).post('/duplicate-error').send(duplicateError);
        expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        // Add assertions for the specific error messages
    }));
    it('should handle CastError', () => __awaiter(void 0, void 0, void 0, function* () {
        const castError = {
            name: 'CastError',
            value: 'invalid-id',
        };
        const response = yield (0, supertest_1.default)(app).post('/cast-error').send(castError);
        expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND); // Corrected status code
    }));
    it('should handle unknown errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/unknown-error').send({});
        expect(response.status).toBe(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body.msg).toBe('Something went wrong, please try again later');
    }));
});
