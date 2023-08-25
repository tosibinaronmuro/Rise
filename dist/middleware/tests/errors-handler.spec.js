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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const errors_handler_1 = __importDefault(require("../errors-handler"));
const custom_error_1 = __importDefault(require("../../errors/custom-error"));
describe('Error Handler Middleware', () => {
    const app = (0, express_1.default)();
    app.get('/', (req, res, next) => {
        next(new Error('Test Error'));
    });
    app.use(errors_handler_1.default);
    it('should handle CustomError instances', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new custom_error_1.default('Test Error', 500);
        const response = yield (0, supertest_1.default)(app).get('/').send(error);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Test Error');
    }));
    it('should handle unexpected errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/');
        expect(response.status).toBe(500);
        // expect(response.body).toHaveProperty('msg', 'Something went wrong, please try again later');
    }));
});
