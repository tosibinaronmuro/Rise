"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
router.route('/register').post(auth_1.register);
router.route('/login').post(auth_1.login);
router.get('/logout', auth_1.logout);
router.post("/forgot-password", auth_1.forgotPassword);
router.post("/reset-password", auth_1.resetPassword);
exports.default = router;
