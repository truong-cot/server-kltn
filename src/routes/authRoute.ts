import express from 'express';
import AuthController from '../app/controllers/authController';

const router = express.Router();

// Đăng kí tài khoản
router.post('/register', AuthController.register);

// Đăng nhập web user
router.post('/login', AuthController.login);

// Đăng nhập trang quản trị
router.post('/login-admin', AuthController.loginAdmin);

export default router;
