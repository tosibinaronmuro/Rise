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
exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const express_1 = __importDefault(require("express"));
const errors_1 = require("../errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbConfig_1 = __importDefault(require("../dbConfig"));
const crypto_1 = require("crypto");
const helper_1 = require("../utils/helper");
const router = express_1.default.Router();
const secretKey = process.env.JWT_SECRET || "";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            throw new errors_1.BadRequest('Please provide name, email, and password');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const client = yield dbConfig_1.default.connect();
        try {
            yield client.query('BEGIN');
            const emailExistsQuery = 'SELECT * FROM users WHERE email = $1';
            const emailExistsResult = yield client.query(emailExistsQuery, [email]);
            if (emailExistsResult.rows.length > 0) {
                throw new errors_1.BadRequest('Email already exists');
            }
            const insertUserQuery = 'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id';
            const insertUserResult = yield client.query(insertUserQuery, [
                fullname,
                email,
                hashedPassword,
            ]);
            yield client.query('COMMIT');
            const payload = { userId: insertUserResult.rows[0].id, name: fullname, email: email };
            const token = jsonwebtoken_1.default.sign(payload, secretKey);
            res.status(201).json({ message: 'Registration successful', user: payload });
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
//  add a public_key column to the users // usertable should have public key and uploads 
//the uploads would contain their userid, fullname and link to the bucket holding the value
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errors_1.BadRequest('Please provide email and password');
        }
        const client = yield dbConfig_1.default.connect();
        try {
            const userQuery = 'SELECT * FROM users WHERE email = $1';
            const userResult = yield client.query(userQuery, [email]);
            if (userResult.rows.length === 0) {
                throw new errors_1.BadRequest('User not found');
            }
            const user = userResult.rows[0];
            const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!passwordMatch) {
                throw new errors_1.BadRequest('Invalid password');
            }
            const { publicKey, privateKey } = (0, crypto_1.generateKeyPairSync)('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });
            const payload = { userId: user.id, name: user.fullname, email: user.email, publicKey };
            const updatePublicKeyQuery = 'UPDATE users SET "publicKey" = $1 WHERE id = $2';
            yield client.query(updatePublicKeyQuery, [publicKey, user.id]);
            const token = jsonwebtoken_1.default.sign(payload, secretKey);
            res.status(200).json({ message: 'Login successful', user: payload, token });
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
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log(req.user, 'hello');
        if (!userId) {
            throw new errors_1.Unauthenticated('User not authenticated');
        }
        const client = yield dbConfig_1.default.connect();
        try {
            const updatePublicKeyQuery = 'UPDATE users SET "publicKey" = NULL WHERE id = $1';
            yield client.query(updatePublicKeyQuery, [userId]);
            res.status(200).json({ message: 'Logout successful' });
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
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            throw new errors_1.BadRequest("Please provide an email address");
        }
        const client = yield dbConfig_1.default.connect();
        try {
            const userQuery = "SELECT * FROM users WHERE email = $1";
            const userResult = yield client.query(userQuery, [email]);
            if (userResult.rows.length === 0) {
                throw new errors_1.BadRequest("User not found");
            }
            const user = userResult.rows[0];
            const resetToken = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, {
                expiresIn: "5m",
            });
            const resetLink = `http://localhost:3000/reset-password/?token=${resetToken}`;
            const mailConfigs = {
                from: process.env.MY_EMAIL,
                to: user.email,
                subject: "Reset Password for Your App",
                html: (0, helper_1.forgotPasswordEmailTemplate)(resetLink, user.fullname),
            };
            yield helper_1.mailTransport.sendMail(mailConfigs);
            res
                .status(200)
                .json({ message: "Password reset link sent to your email" });
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
        res
            .status(error.status || 500)
            .json({ message: error.message || "An error occurred" });
    }
});
exports.forgotPassword = forgotPassword;
// this controller uses a one time token 
// const forgotPassword = async (req: Request, res: Response) => {
//     try {
//       const { email } = req.body;
//       if (!email) {
//         throw new BadRequest("Please provide an email address");
//       }
//       const client = await pool.connect();
//       try {
//         const userQuery = "SELECT * FROM users WHERE email = $1";
//         const userResult = await client.query(userQuery, [email]);
//         if (userResult.rows.length === 0) {
//           throw new BadRequest("User not found");
//         }
//         const user = userResult.rows[0];
//       
//         const resetToken = crypto.randomBytes(32).toString('hex');
//          
//         const updateTokenQuery = "UPDATE users SET reset_token = $1 WHERE id = $2";
//         await client.query(updateTokenQuery, [resetToken, user.id]);
//         const resetLink = `http://localhost:3000/reset-password/?token=${resetToken}`;
//         const mailConfigs = {
//           from: process.env.MY_EMAIL,
//           to: user.email,
//           subject: "Reset Password for Your App",
//           html: forgotPasswordEmailTemplate(resetLink, user.fullname),
//         };
//         await mailTransport.sendMail(mailConfigs);
//         res
//           .status(200)
//           .json({ message: "Password reset link sent to your email" });
//       } catch (error) {
//         throw error;
//       } finally {
//         client.release();
//       }
//     } catch (error: string[] | any) {
//       console.error(error);
//       res
//         .status(error.status || 500)
//         .json({ message: error.message || "An error occurred" });
//     }
//   };
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            throw new errors_1.BadRequest("Please provide token and new password");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        const userId = decodedToken.userId;
        const loginLink = `http://localhost:3000/`;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const client = yield dbConfig_1.default.connect();
        try {
            const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2';
            yield client.query(updateQuery, [hashedPassword, userId]);
            // Send confirmation email
            const userQuery = 'SELECT * FROM users WHERE id = $1';
            const userResult = yield client.query(userQuery, [userId]);
            const user = userResult.rows[0];
            const mailConfigs = {
                from: process.env.MY_EMAIL,
                to: user.email,
                subject: "Password Change Confirmation",
                html: (0, helper_1.resetPasswordEmailTemplate)(loginLink, user.fullname),
            };
            yield helper_1.mailTransport.sendMail(mailConfigs);
            res.status(200).json({ message: "Password reset successful" });
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
        res
            .status(error.status || 500)
            .json({ message: error.message || "An error occurred" });
    }
});
exports.resetPassword = resetPassword;
