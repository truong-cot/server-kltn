import {Request, Response} from 'express';
import resultData from '../../common/resultData';
import UserModel from '../models/user';
import cloudinary from '../../config/cloudinary';
import {v4 as uuidv4} from 'uuid';

const UserController = {
	// [GET] ==> /user/all-user?keyword=truong&limit=10&page=1&type=2
	getAllUser: async (req: Request, res: Response) => {
		try {
			// type: 0 => all, type: 1 => admin, type: 2 => user
			var users: any;
			var countUser;

			const {keyword, limit, page, type} = req.query;

			if (type === '0') {
				users = await UserModel.find({
					$or: [
						{
							username: {$regex: keyword, $options: '$i'},
						},
						{
							name: {$regex: keyword, $options: '$i'},
						},
					],
				})
					.skip(Number(page) * Number(limit) - Number(limit))
					.limit(Number(limit));

				// Lấy tổng user
				countUser = await UserModel.countDocuments();
			} else if (type === '1') {
				users = await UserModel.find({
					isAdmin: true,
					$or: [
						{
							username: {$regex: keyword, $options: '$i'},
						},
						{
							name: {$regex: keyword, $options: '$i'},
						},
					],
				})
					.skip(Number(page) * Number(limit) - Number(limit))
					.limit(Number(limit));

				// Lấy tổng tài khoản admin
				countUser = await UserModel.countDocuments({isAdmin: true});
			} else if (type === '2') {
				users = await UserModel.find({
					isAdmin: false,
					$or: [
						{
							username: {$regex: keyword, $options: '$i'},
						},
						{
							name: {$regex: keyword, $options: '$i'},
						},
					],
				})
					.skip(Number(page) * Number(limit) - Number(limit))
					.limit(Number(limit));

				// Lấy tổng tài khoản user
				countUser = await UserModel.countDocuments({isAdmin: false});
			}

			if (users?.length > 0) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Lấy tài khoản thành công!',
						data: {users, countUser},
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Danh sách tài khoản trống!',
						data: {users, countUser},
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
	// [POST] ==> /user/change-role
	changeRole: async (req: Request, res: Response) => {
		try {
			const userId = req.query.idUser;

			const user = await UserModel.findById(userId);

			if (user) {
				if (user?.isAdmin === false) {
					user.isAdmin = true;

					const newUser = await user.save();

					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message:
								'Thay đổi thành tài khoản admin thành công!',
							data: newUser,
						})
					);
				} else if (user?.isAdmin === true) {
					user.isAdmin = false;

					const newUser = await user.save();

					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message:
								'Thay đổi thành tài khoản người dùng thành công!',
							data: newUser,
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tài khoản không tồn tại!',
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
	// [DELETE] ==> /user/delete-user?idUser=....
	deleteUser: async (req: Request, res: Response) => {
		try {
			const userId = req.query.idUser;

			const user = await UserModel.findByIdAndDelete(userId);

			if (user) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Xóa tài khoản thành công!',
						data: user,
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tài khoản không tồn tại!',
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

	// [PUT] ==> /user/update-user?idUser=...
	updateUser: async (req: Request, res: Response) => {
		try {
			const userId = req.query.idUser;

			const user = await UserModel.findByIdAndUpdate(userId, req.body);

			const newUser = await UserModel.findById(userId);

			if (user) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Cập nhập tài khoản thành công!',
						data: newUser,
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tài khoản không tồn tại!',
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

	// [GET] ==> /user/current-user
	getCurrentUser: async (req: Request, res: Response) => {
		try {
			const userId = req.params.id;

			const user = await UserModel.findById(userId);

			if (user) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Lấy tài khoản đăng nhập hiện tại thành công!',
						data: user,
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Tài khoản không tồn tại!',
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

	// [POST] ==> /user/change-avatar
	changeAvatar: async (req: Request, res: Response) => {
		try {
			const idUser = req.body.idUser;
			const fileImage: any = req.file;

			const checkUser = await UserModel.findById(idUser);

			if (checkUser) {
				const saveImg = await cloudinary.uploader.upload(
					fileImage.path
				);

				// Thay avatar
				const user = await UserModel.updateOne(
					{_id: String(idUser)},
					{
						$set: {
							avatar: saveImg.secure_url,
						},
					}
				);

				const showUser = await UserModel.findById(idUser);

				if (user) {
					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message: 'Thay avatar thành công!',
							data: showUser,
						})
					);
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Người dùng không tồn tại!',
							data: {},
						})
					);
				}
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

	// [POST] ==> /user/add-address
	addAddress: async (req: Request, res: Response) => {
		try {
			const {idUser, name, phone, city, district, ward, specifically} =
				req.body;

			if (idUser) {
				const checkUser = await UserModel.findById(idUser);

				if (checkUser) {
					if (
						name &&
						phone &&
						city &&
						district &&
						ward &&
						specifically
					) {
						// Lấy ra mảng địa chỉ có trước
						const listAddress = checkUser.address;

						// Tạo mới địa chỉ
						const newAddress = {
							id: uuidv4(),
							name: name,
							phone: phone,
							city: city,
							district: district,
							ward: ward,
							specifically: specifically,
							isDefault: false,
						};

						// Thêm địa chỉ mới vào mảng địa chỉ cũ
						listAddress.push(newAddress);

						// Update user
						const saveUser = await UserModel.updateOne(
							{_id: idUser},
							{
								$set: {
									address: listAddress,
								},
							}
						);

						if (saveUser) {
							const user = await UserModel.findById(idUser);

							return res.status(200).json(
								resultData({
									code: 200,
									status: 1,
									message:
										'Thêm địa chỉ giao hàng thành công!',
									data: user,
								})
							);
						}
					} else {
						return res.status(201).json(
							resultData({
								code: 201,
								status: 0,
								message: 'Vui lòng nhập đầy đủ thông tin!',
								data: {},
							})
						);
					}
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Người dùng không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Vui lòng nhập ID người dùng!',
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

	// [DELETE] ==> /user/delete-address
	deleteAddress: async (req: Request, res: Response) => {
		try {
			const idUser = req.params.id;
			const idAddress = req.query.idAddress;

			// Hàm xóa địa chỉ
			const deleteAddress = async (arr: Array<any>, id: string) => {
				const indexImage = arr.findIndex((v) => v.id === id);

				if (indexImage > -1) {
					arr.splice(indexImage, 1);
				}

				return arr;
			};

			if (idUser && idAddress) {
				// Tìm user
				const checkUser = await UserModel.findById(idUser);

				if (checkUser) {
					// Lấy ra danh sách địa chỉ
					const listAddress = checkUser.address;

					if (listAddress.length === 0) {
						return res.status(201).json(
							resultData({
								code: 201,
								status: 0,
								message: 'Người dùng chưa có địa chỉ nào!',
								data: {},
							})
						);
					} else {
						// Tìm id của địa chỉ
						const item = listAddress.find(
							(v: any) => v.id === idAddress
						);

						if (item) {
							// Gọi hàm xóa địa chỉ
							await deleteAddress(listAddress, String(idAddress));

							// Update user
							const saveUser = await UserModel.updateOne(
								{_id: idUser},
								{
									$set: {
										address: listAddress,
									},
								}
							);

							if (saveUser) {
								const user = await UserModel.findById(idUser);

								return res.status(200).json(
									resultData({
										code: 200,
										status: 1,
										message:
											'Xóa địa chỉ giao hàng thành công!',
										data: user,
									})
								);
							}
						} else {
							return res.status(201).json(
								resultData({
									code: 201,
									status: 0,
									message: 'Địa chỉ không tồn tại!',
									data: {},
								})
							);
						}
					}
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Người dùng không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Chưa có thông tin!',
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

	// [POST] ==> /user/default-address
	defaultAddress: async (req: Request, res: Response) => {
		try {
			const {idUser, idAddress} = req.body;

			if (idUser && idAddress) {
				// Tìm user
				const checkUser = await UserModel.findById(idUser);

				if (checkUser) {
					// Lấy ra danh sách địa chỉ
					const listAddress = checkUser.address;

					if (listAddress.length === 0) {
						return res.status(201).json(
							resultData({
								code: 201,
								status: 0,
								message: 'Người dùng chưa có địa chỉ nào!',
								data: {},
							})
						);
					} else {
						// Tìm id của địa chỉ
						const item = listAddress.find(
							(v: any) => v.id === idAddress
						);

						if (item) {
							// Đổi địa chỉ mặc định thành không mặc định
							for (var address of listAddress) {
								if (address.isDefault === true) {
									address.isDefault = false;
								}
							}

							// Đổi địa chỉ thành địa chỉ mặc định
							for (var address of listAddress) {
								if (address.id === idAddress) {
									address.isDefault = true;
								}
							}

							// Update user
							const saveUser = await UserModel.updateOne(
								{_id: idUser},
								{
									$set: {
										address: listAddress,
									},
								}
							);

							if (saveUser) {
								const user = await UserModel.findById(idUser);

								return res.status(200).json(
									resultData({
										code: 200,
										status: 1,
										message:
											'Đổi địa chỉ mặc định thành công!',
										data: user,
									})
								);
							}
						} else {
							return res.status(201).json(
								resultData({
									code: 201,
									status: 0,
									message: 'Địa chỉ không tồn tại!',
									data: {},
								})
							);
						}
					}
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Người dùng không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Chưa có thông tin!',
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

	// [POST] ==> /user/change-address
	changeAddress: async (req: Request, res: Response) => {},
};

export default UserController;
