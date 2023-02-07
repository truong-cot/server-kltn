import express from 'express';
import CartController from '../app/controllers/cartController';
import {authMiddlewares} from '../middlewares/auth';

const router = express.Router();

// Thêm đơn hàng vào giỏ hàng
router.post(
	'/add-to-cart',
	authMiddlewares.authVerify,
	CartController.addToCart
);

// Lấy giỏ hàng của người dùng
router.get('/get-cart', authMiddlewares.authVerify, CartController.getCartUser);

// Xóa giỏ hàng của người dùng
router.delete(
	'/delete-cart',
	authMiddlewares.authVerify,
	CartController.deleteCartUser
);

export default router;
