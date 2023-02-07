import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import resultData from '../common/resultData';

export const authMiddlewares = {
	authVerify: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const headerToken: any = req.headers?.token;

			if (headerToken) {
				const token = headerToken.split(' ')[1];

				jwt.verify(
					token,
					String(process.env.JWT_SECRET),
					(err: any, data: any) => {
						if (err) {
							return res.status(201).json(
								resultData({
									code: 201,
									status: 0,
									message: 'Token không hợp lệ!',
									data: {},
								})
							);
						} else {
							next();
						}
					}
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Bạn chưa có token!',
						data: {},
					})
				);
			}
		} catch (error) {
			return res.status(500).json(
				resultData({
					code: 500,
					status: 0,
					message: 'Có lỗi xảy ra!',
					data: {},
				})
			);
		}
	},
	isAdmin: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const headerToken: any = req.headers?.token;

			// console.log(req.headers);

			if (headerToken) {
				const token = headerToken.split(' ')[1];

				jwt.verify(
					token,
					String(process.env.JWT_SECRET),
					(err: any, data: any) => {
						if (err) {
							return res.status(201).json(
								resultData({
									code: 201,
									status: 0,
									message: 'Token không hợp lệ!',
									data: {},
								})
							);
						} else {
							if (data.admin) {
								next();
							} else {
								return res.status(201).json(
									resultData({
										code: 201,
										status: 0,
										message: 'Bạn chưa đủ quyền truy cập!',
										data: {},
									})
								);
							}
						}
					}
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Bạn chưa có token!',
						data: {},
					})
				);
			}
		} catch (error) {
			return res.status(500).json(
				resultData({
					code: 500,
					status: 0,
					message: 'Có lỗi xảy ra!',
					data: {},
				})
			);
		}
	},
};
