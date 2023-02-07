import express from 'express';

import ProductController from '../app/controllers/productController';
import {authMiddlewares} from '../middlewares/auth';

const router = express.Router();

import multer from 'multer';

const storage = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});
const upload = multer({storage});

// Thêm sản phẩm
router.post('/create', authMiddlewares.isAdmin, ProductController.create);

// Thêm ảnh cho sản phẩm
router.post(
	'/add-images',
	authMiddlewares.isAdmin,
	upload.single('file'),
	ProductController.addImage
);

// Xóa ảnh sản phẩm
router.delete(
	'/delete-image/:id',
	authMiddlewares.isAdmin,
	ProductController.deleteImage
);

// Lấy ra danh sách ảnh
router.get(
	'/get-all-images/:id',
	authMiddlewares.isAdmin,
	ProductController.getAllImage
);

// Xóa sản phẩm
router.delete(
	'/delete-product',
	authMiddlewares.isAdmin,
	ProductController.deleteProduct
);

// Chỉnh sửa sản phẩm
router.post(
	'/update-product',
	authMiddlewares.isAdmin,
	ProductController.updateProduct
);

// Lấy tất cả sản phẩm
router.get(
	'/get-all-product',
	// authMiddlewares.isAdmin,
	ProductController.getAllProduct
);

// Lấy chi tiết sản phẩm
router.get(
	'/get-detail-product/:id',
	// authMiddlewares.authVerify,
	ProductController.getDetailProduct
);

// Đánh giá sản phẩm
router.post(
	'/create-review',
	authMiddlewares.authVerify,
	ProductController.createReview
);

// Thêm số lượng cho sản phẩm
router.post(
	'/add-amount',
	authMiddlewares.isAdmin,
	ProductController.addAmount
);

export default router;
