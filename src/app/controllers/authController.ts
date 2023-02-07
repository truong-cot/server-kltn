import bcrypt from 'bcrypt';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import resultData from '../../common/resultData';
import isEmail from '../../common/isEmail';
import hasWhiteSpace from '../../common/usernameCheck';
import checkSpecialCharacters from '../../common/checkSpecialCharacters';

const AuthController = {
	// [POST] ==> /auth/register (Đăng kí tài khoản)
	register: async (req: Request, res: Response) => {
		try {
			// Lấy data từ body
			const {name, username, email, password} = req.body;
			const usernameCheck = await UserModel.findOne({username: username});
			const emailCheck = await UserModel.findOne({email: email});

			// Hash mật khẩu
			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(password, salt);

			// Validate
			if (!name || !username || !email || !password) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Vui lòng nhập đầy đủ thông tin',
						data: {},
					})
				);
			}

			if (usernameCheck) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tên đăng nhập đã tồn tại!!!',
						data: {},
					})
				);
			}

			if (emailCheck) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Địa chỉ email đã tồn tại!!!',
						data: {},
					})
				);
			}

			// Check username không được chưa có dấu cách
			if (hasWhiteSpace(username)) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tên đăng nhập không được chứa khoảng trắng!',
						data: {},
					})
				);
			}

			// Check username không được chứa kí tự đặc biệt
			if (checkSpecialCharacters(username)) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message:
							'Tên đăng nhập không được chứa kí tự đặc biệt!',
						data: {},
					})
				);
			}

			// Check isEmail đúng định dạng
			if (!isEmail(email)) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Địa chỉ email không hợp lệ!!!',
						data: {},
					})
				);
			}

			// Tạo uesr mới
			const newUser = await new UserModel({
				name: req.body.name,
				username: req.body.username,
				email: req.body.email,
				password: hashed,
			});

			// Lưu user mới với db
			const user = await newUser.save();

			// Trả về dữ liệu
			return res.status(200).json(
				resultData({
					code: 200,
					status: 1,
					message: 'Tạo tại khoản thành công!!!',
					data: user,
				})
			);
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

	// [POST] ==> /auth/login (Đăng nhập trang người dùng)
	login: async (req: Request, res: Response) => {
		try {
			const {acc, password} = req.body;

			// Đăng nhập theo username
			const user: any = await UserModel.findOne({username: acc});

			if (!user) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tài khoản đăng nhập không tồn tại!',
						data: {},
					})
				);
			}

			// Valid Password trả về true hoặc false
			const validPassword = await bcrypt.compare(
				password,
				String(user?.password)
			);
			if (!validPassword) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Mật khẩu không chính xác!',
						data: {},
					})
				);
			}

			if (user && validPassword) {
				const accessToken = jwt.sign(
					{
						_id: user._id.toString(),
						admin: user.isAdmin,
					},
					String(process.env.JWT_SECRET),
					{expiresIn: '2h'}
				);

				const {password, ...orther} = user?._doc;

				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Đăng nhập thành công!',
						data: {user: {...orther, token: accessToken}},
					})
				);
			}
		} catch (error) {
			return res.status(500).json(
				resultData({
					code: 500,
					status: 0,
					message: 'Có lỗi xảy ra !',
					data: {},
				})
			);
		}
	},

	// [POST] ==> /auth/login-admin (Đăng nhập trang quản trị)
	loginAdmin: async (req: Request, res: Response) => {
		try {
			const {acc, password} = req.body;

			// Đăng nhập theo username
			const user: any = await UserModel.findOne({
				username: acc,
				isAdmin: true,
			});

			if (!user) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tài khoản đăng nhập không tồn tại!',
						data: {},
					})
				);
			}

			// Valid Password trả về true hoặc false
			const validPassword = await bcrypt.compare(
				password,
				`${user?.password}`
			);

			if (!validPassword) {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Mật khẩu không chính xác!',
						data: {},
					})
				);
			}

			if (user && validPassword) {
				const accessToken = jwt.sign(
					{
						_id: user._id.toString(),
						admin: user.isAdmin,
					},
					String(process.env.JWT_SECRET),
					{expiresIn: '2h'}
				);

				const {password, ...orther} = user?._doc;

				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Đăng nhập thành công!',
						data: {user: {...orther, token: accessToken}},
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

export default AuthController;
