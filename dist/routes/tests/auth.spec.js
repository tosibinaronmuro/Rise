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
const auth_1 = __importDefault(require("../auth"));
const auth_2 = require("../../controllers/auth");
jest.mock('../../controllers/auth', () => ({
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
}));
const app = (0, express_1.default)();
app.use('/', auth_1.default);
describe('Auth Routes', () => {
    it('should call register function when POST /register', () => __awaiter(void 0, void 0, void 0, function* () {
        auth_2.register.mockImplementationOnce((req, res) => {
            res.send('register');
        });
        const response = yield (0, supertest_1.default)(app).post('/register');
        expect(response.status).toBe(200);
        expect(auth_2.register).toHaveBeenCalled();
    }));
    it('should call login function when POST /login', () => __awaiter(void 0, void 0, void 0, function* () {
        auth_2.login.mockImplementationOnce((req, res) => {
            res.send('login');
        });
        const response = yield (0, supertest_1.default)(app).post('/login');
        expect(response.status).toBe(200);
        expect(response.text).toBe('login');
        expect(auth_2.login).toHaveBeenCalled();
    }));
    it('should call logout function when GET /logout', () => __awaiter(void 0, void 0, void 0, function* () {
        auth_2.logout.mockImplementationOnce((req, res) => {
            res.send('logout');
        });
        const response = yield (0, supertest_1.default)(app).get('/logout');
        expect(response.status).toBe(200);
        expect(response.text).toBe('logout');
        expect(auth_2.logout).toHaveBeenCalled();
    }));
    it('should call forgotPassword function when POST /forgot-password', () => __awaiter(void 0, void 0, void 0, function* () {
        auth_2.forgotPassword.mockImplementationOnce((req, res) => {
            res.send('forgot-password');
        });
        const response = yield (0, supertest_1.default)(app).post('/forgot-password');
        expect(response.status).toBe(200);
        expect(auth_2.forgotPassword).toHaveBeenCalled();
    }));
    it('should call resetPassword function when POST /reset-password', () => __awaiter(void 0, void 0, void 0, function* () {
        auth_2.resetPassword.mockImplementationOnce((req, res) => {
            res.send('reset-password');
        });
        const response = yield (0, supertest_1.default)(app).post('/reset-password');
        expect(response.status).toBe(200);
        expect(auth_2.resetPassword).toHaveBeenCalled();
    }));
});
