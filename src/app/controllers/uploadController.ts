import {Request, Response} from 'express';
import resultData from '../../common/resultData';

import uploader from '../../config/cloudinary';

const UploadController = {
	// [POST] ==> /upload/images
	// uploadImages: async (req: Request, res: Response) => {
	// 	try {
	// 		const images: any = req.files;
	// 		const checkTypeImage = images.some(
	// 			(image: any) =>
	// 				image.mimetype !== 'image/jpeg' &&
	// 				image.mimetype !== 'image/jpg' &&
	// 				image.mimetype !== 'image/png'
	// 		);
	// 		//
	// 		var urls: Array<any> = [];
	// 		if (Number(images?.length) > 0) {
	// 			// Đúng định dạng ảnh
	// 			if (checkTypeImage === false) {
	// 				for (const image of images) {
	// 					const newUrl = await uploader(image.path, 'KLTN');
	// 					urls.push(newUrl);
	// 				}
	// 				return res.status(200).json(
	// 					resultData({
	// 						code: 200,
	// 						status: 1,
	// 						message: 'Thêm ảnh thành công!',
	// 						data: urls,
	// 					})
	// 				);
	// 			} else {
	// 				// Sai định dạng ảnh
	// 				return res.status(201).json(
	// 					resultData({
	// 						code: 201,
	// 						status: 0,
	// 						message: 'Ảnh không đúng định dạng!',
	// 						data: {},
	// 					})
	// 				);
	// 			}
	// 		} else {
	// 			return res.status(201).json(
	// 				resultData({
	// 					code: 201,
	// 					status: 0,
	// 					message: 'Không có ảnh nào được thêm!',
	// 					data: {},
	// 				})
	// 			);
	// 		}
	// 	} catch (error) {
	// 		return res.status(500).json(
	// 			resultData({
	// 				code: 500,
	// 				status: 0,
	// 				message: 'Có lỗi xảy ra!',
	// 				data: {},
	// 			})
	// 		);
	// 	}
	// },
};

export default UploadController;
