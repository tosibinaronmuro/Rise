import express from 'express';
import { register, login, logout,resetPassword,forgotPassword } from '../controllers/auth-users';
import authMiddleware from '../middleware/auth'

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.get('/logout', authMiddleware,logout);



export default router;
