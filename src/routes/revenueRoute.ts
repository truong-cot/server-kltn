import express from 'express';
import revenueController from '../app/controllers/revenueController';
import {authMiddlewares} from '../middlewares/auth';

const router = express.Router();

// Tính tất cả doanh thu
router.get(
	'/get-order-revenue',
	authMiddlewares.isAdmin,
	revenueController.getOrderRevenue
);

// Lấy những sản phẩm sắp hết hàng
router.get(
	'/get-product-out-stock',
	authMiddlewares.isAdmin,
	revenueController.getProductOutStock
);

// Lấy sản phẩm tồn kho
router.get(
	'/get-product-in-stock',
	authMiddlewares.isAdmin,
	revenueController.getProductInStock
);

// Tính tổng doanh thu
router.get(
	'/get-total-revenue',
	authMiddlewares.isAdmin,
	revenueController.getTotalRevenue
);

// Doanh thu từng tháng trong năm
router.get(
	'/get-revenue-month-to-year',
	authMiddlewares.isAdmin,
	revenueController.getRevenueMonthToYear
);

export default router;
