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
const not_found_1 = __importDefault(require("../not-found"));
describe('notFoundHandler', () => {
    const app = (0, express_1.default)();
    app.use(not_found_1.default);
    it('should return a 404 status code', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/invalid-route');
        expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
    }));
    it('should return the "Route does not exist" message', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/invalid-route');
        expect(response.text).toBe('Route does not exist');
    }));
});
