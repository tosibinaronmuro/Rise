"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_admin_1 = require("../controllers/auth-admin");
const admin_auth_1 = __importDefault(require("../middleware/admin-auth"));
const router = express_1.default.Router();
router.route('/register').post(auth_admin_1.register);
router.route('/login').post(auth_admin_1.login);
router.route('/forgot-password').post(auth_admin_1.forgotPassword);
router.route('/reset-password').post(auth_admin_1.resetPassword);
router.get('/logout', admin_auth_1.default, auth_admin_1.logout);
exports.default = router;
