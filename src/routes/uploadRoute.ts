import express from 'express';

const router = express.Router();

import multer from 'multer';
const storage = multer.diskStorage({
	filename: function (req: any, file: any, cb: any) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});
const upload = multer({storage});

// // Upload nhiều ảnh
// router.post(
// 	'/images',
// 	upload.array('images', 12),
// 	authMiddlewares.authVerify,
// 	UploadController.uploadImages
// );

export default router;
