import express from 'express';
import OrderController from '../app/controllers/orderController';

const router = express.Router();

// Tạo đơn hàng
router.post('/create-order', OrderController.createOrder);

// Xác nhận đơn hàng
router.post('/confirmation-order', OrderController.confirmationOrder);

// Hủy đơn hàng
router.post('/cancel-order', OrderController.cancelOrder);

// Xác nhận đã nhận hàng
router.post('/confirmation-delivery', OrderController.confirmationDelivery);

// Lấy chi tiết đơn hàng
router.get('/get-detail-order', OrderController.getDetailOrder);

// Lấy tất cả đơn hàng đơn hàng
router.get('/get-all-order', OrderController.getAllOrder);

// Lấy đơn hàng của user
router.get('/get-order-user', OrderController.getOrderUser);

export default router;
