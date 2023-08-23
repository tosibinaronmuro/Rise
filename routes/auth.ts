import express from 'express';
import { register, login, logout,resetPassword,forgotPassword } from '../controllers/auth';
 

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.get('/logout', logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);


export default router;
