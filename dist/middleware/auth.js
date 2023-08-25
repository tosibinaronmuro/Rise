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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../errors");
const dbConfig_1 = __importDefault(require("../dbConfig"));
const secretKey = process.env.JWT_SECRET || '';
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new errors_1.Unauthenticated('Authentication invalid');
    }
    let token;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        throw new errors_1.Unauthenticated('Authentication invalid');
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        const client = yield dbConfig_1.default.connect();
        try {
            const userQuery = 'SELECT "publicKey" FROM users WHERE id = $1';
            const userResult = yield client.query(userQuery, [payload.userId]);
            if (userResult.rows.length === 0) {
                throw new errors_1.Unauthenticated('User not found');
            }
            const userPublicKey = userResult.rows[0].publicKey;
            if (userPublicKey !== payload.publicKey) {
                throw new errors_1.Unauthenticated('Public key mismatch, retry login');
            }
            req.user = payload;
            next();
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = authMiddleware;
