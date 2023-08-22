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
exports.logout = exports.login = exports.register = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbConfig_1 = __importDefault(require("../dbConfig"));
const router = express_1.default.Router();
const secretKey = process.env.JWT_SECRET || '';
;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            throw new errors_1.BadRequest("Please provide name, email, and password");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const client = yield dbConfig_1.default.connect();
        try {
            yield client.query('BEGIN');
            const emailExistsQuery = 'SELECT * FROM users WHERE email = $1';
            const emailExistsResult = yield client.query(emailExistsQuery, [email]);
            if (emailExistsResult.rows.length > 0) {
                throw new errors_1.BadRequest("Email already exists");
            }
            const insertUserQuery = 'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id';
            const insertUserResult = yield client.query(insertUserQuery, [
                fullname,
                email,
                hashedPassword,
            ]);
            console.log('Registration successful');
            yield client.query('COMMIT');
            const token = jsonwebtoken_1.default.sign({ userId: insertUserResult.rows[0].id }, secretKey);
            res.status(201).json({ message: 'Registration successful', token });
        }
        catch (error) {
            yield client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message || 'An error occurred' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errors_1.BadRequest("Please provide email and password");
        }
        const client = yield dbConfig_1.default.connect();
        try {
            const userQuery = 'SELECT * FROM users WHERE email = $1';
            const userResult = yield client.query(userQuery, [email]);
            if (userResult.rows.length === 0) {
                throw new errors_1.BadRequest("User not found");
            }
            const user = userResult.rows[0];
            const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!passwordMatch) {
                throw new errors_1.BadRequest("Invalid password");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey);
            res.status(200).json({ message: 'Login successful', username: user.fullname, token });
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message || 'An error occurred' });
    }
});
exports.login = login;
const logout = (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send("logout");
};
exports.logout = logout;
