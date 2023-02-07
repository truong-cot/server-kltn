import {Request, Response} from 'express';
import resultData from '../../common/resultData';

import ProductModel from '../models/product';
import UserModel from '../models/user';
import {v4 as uuidv4} from 'uuid';

import cloudinary from '../../config/cloudinary';

const ProductController = {
	// [POST] ==> /product/create
	create: async (req: Request, res: Response) => {
		try {
			const {
				name,
				price,
				category,
				sale,
				amount_size_S,
				amount_size_M,
				amount_size_L,
				amount_size_XL,
				main_des,
				general_des,
				detail_des,
				isHot,
				trending,
			} = req.body;

			// Check tên sản phẩm
			const checkName = await ProductModel.findOne({name: name});

			if (
				name &&
				price &&
				category &&
				sale &&
				amount_size_S &&
				amount_size_M &&
				amount_size_L &&
				amount_size_XL &&
				main_des &&
				general_des &&
				detail_des &&
				isHot &&
				trending
			) {
				if (checkName) {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Tên sản phẩm đã tồn tại!',
							data: {},
						})
					);
				} else {
					// var newProduct;
					// isHot = 0: false, isHot = 1: true
					if (isHot === '0') {
						if (trending === '0') {
							const newProduct = new ProductModel({
								name: name,
								price: price,
								category: Number(category),
								sale: sale,
								isHot: false,
								trending: false,
								amount_size_S: amount_size_S,
								amount_size_M: amount_size_M,
								amount_size_L: amount_size_L,
								amount_size_XL: amount_size_XL,
								main_des: main_des,
								general_des: general_des,
								detail_des: detail_des,
							});

							const saveProduct = await newProduct.save();

							return res.status(200).json(
								resultData({
									code: 200,
									status: 1,
									message: `Thêm sản phẩm thành công!`,
									data: saveProduct,
								})
							);
						} else if (trending === '1') {
							const newProduct = new ProductModel({
								name: name,
								price: price,
								category: Number(category),
								sale: sale,
								isHot: false,
								trending: true,
								amount_size_S: amount_size_S,
								amount_size_M: amount_size_M,
								amount_size_L: amount_size_L,
								amount_size_XL: amount_size_XL,
								main_des: main_des,
								general_des: general_des,
								detail_des: detail_des,
							});

							const saveProduct = await newProduct.save();

							return res.status(200).json(
								resultData({
									code: 200,
									status: 1,
									message: `Thêm sản phẩm thành công!`,
									data: saveProduct,
								})
							);
						}
					} else if (isHot === '1') {
						if (trending === '0') {
							const newProduct = new ProductModel({
								name: name,
								price: price,
								category: Number(category),
								sale: sale,
								isHot: true,
								trending: false,
								amount_size_S: amount_size_S,
								amount_size_M: amount_size_M,
								amount_size_L: amount_size_L,
								amount_size_XL: amount_size_XL,
								main_des: main_des,
								general_des: general_des,
								detail_des: detail_des,
							});

							const saveProduct = await newProduct.save();

							return res.status(200).json(
								resultData({
									code: 200,
									status: 1,
									message: `Thêm sản phẩm thành công!`,
									data: saveProduct,
								})
							);
						} else if (trending === '1') {
							const newProduct = new ProductModel({
								name: name,
								price: price,
								category: Number(category),
								sale: sale,
								isHot: true,
								trending: true,
								amount_size_S: amount_size_S,
								amount_size_M: amount_size_M,
								amount_size_L: amount_size_L,
								amount_size_XL: amount_size_XL,
								main_des: main_des,
								general_des: general_des,
								detail_des: detail_des,
							});

							const saveProduct = await newProduct.save();

							return res.status(200).json(
								resultData({
									code: 200,
									status: 1,
									message: `Thêm sản phẩm thành công!`,
									data: saveProduct,
								})
							);
						}
					}
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Nhập đầy đủ thông tin!',
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
	// [POST] ==> /product/add-images/...id
	addImage: async (req: Request, res: Response) => {
		try {
			const idProduct = req.body.idProduct;
			const fileImage: any = req.file;

			const checkProduct = await ProductModel.findById(idProduct);

			if (checkProduct) {
				//Danh sách ảnh của sản phẩm
				var urls: any = checkProduct.images;

				const saveImg = await cloudinary.uploader.upload(
					fileImage.path
				);

				const url: any = {
					id: saveImg.public_id,
					url: saveImg.secure_url,
				};

				urls.push(url);

				// Thêm ảnh vào mảng images
				const product = await ProductModel.updateOne(
					{_id: idProduct},
					{
						$set: {
							images: urls,
						},
					}
				);

				if (product) {
					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message: 'Thêm ảnh thành công!',
							data: urls,
						})
					);
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Sản phẩm không tồn tại!',
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
	// [DELETE] ==> /product/delete-images/...id?idImage=1233
	deleteImage: async (req: Request, res: Response) => {
		try {
			// Lấy id sản phẩm và id image
			const idProduct = req.params.id;
			const idImage = req.query.idImage;

			// Lấy sản phẩm theo ID
			const product = await ProductModel.findById(idProduct);

			// Hàm xóa ảnh
			const deleteImage = async (arr: Array<any>, id: string) => {
				const indexImage = arr.findIndex((v) => v.id === id);

				if (indexImage > -1) {
					arr.splice(indexImage, 1);
				}

				return arr;
			};

			if (idProduct && idImage) {
				if (product) {
					// Lấy ảnh của sản phẩm
					const listImages: any = product?.images;

					if (listImages.length === 0) {
						return res.status(201).json(
							resultData({
								code: 201,
								status: 0,
								message: 'Sản phẩm chưa có ảnh nào!',
								data: {},
							})
						);
					} else {
						// Tìm id của ảnh
						const item = listImages.find(
							(v: any) => v.id === idImage
						);
						if (item) {
							// Gọi hàm xóa ảnh
							await deleteImage(listImages, String(idImage));

							// Update danh sách ảnh cho sản phẩm
							const product = await ProductModel.updateOne(
								{_id: idProduct},
								{
									$set: {
										images: listImages,
									},
								}
							);

							//
							if (product) {
								return res.status(200).json(
									resultData({
										code: 200,
										status: 1,
										message: 'Xóa ảnh thành công!',
										data: listImages,
									})
								);
							}
						} else {
							return res.status(201).json(
								resultData({
									code: 201,
									status: 0,
									message: 'ID ảnh không tồn tại!',
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
							message: 'Sản phẩm không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Không tìm thấy ID sản phẩm và ID ảnh!',
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
	// [GET] ==> /product/get-all-images
	getAllImage: async (req: Request, res: Response) => {
		try {
			const idProduct = req.params.id;

			// Lấy sản phẩm theo ID
			const product = await ProductModel.findById(idProduct);

			if (product) {
				const listImages: any = product.images;

				if (listImages.length === 0) {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Sản phẩm chưa có ảnh nào!',
							data: listImages,
						})
					);
				} else {
					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message: 'Lấy ảnh của sản phẩm thành công!',
							data: listImages,
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Sản phẩm không tồn tại!',
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
	// [DELETE] ==> /product/delete-images?idProduct=1233
	deleteProduct: async (req: Request, res: Response) => {
		try {
			const idProduct = req.query.idProduct;
			const product = await ProductModel.findByIdAndDelete(idProduct);

			if (product) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Xóa sản phẩm thành công!',
						data: product,
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Sản phẩm không tồn tại!',
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
	// [PUT] ==> /product/delete-images?idProduct=1233
	updateProduct: async (req: Request, res: Response) => {
		try {
			const idProduct = req.query.idProduct;
			const {
				name,
				price,
				category,
				sale,
				isHot,
				trending,
				amount_size_S,
				amount_size_M,
				amount_size_L,
				amount_size_XL,
				main_des,
				general_des,
				detail_des,
			} = req.body;

			const product = await ProductModel.findById(idProduct);

			if (product) {
				if (
					name &&
					price &&
					category &&
					sale &&
					amount_size_S &&
					amount_size_M &&
					amount_size_L &&
					amount_size_XL &&
					main_des &&
					general_des &&
					detail_des &&
					isHot &&
					trending
				) {
					product.name = name;
					product.price = price;
					product.category = category;
					product.sale = sale;
					product.amount_size_S = amount_size_S;
					product.amount_size_M = amount_size_M;
					product.amount_size_L = amount_size_L;
					product.amount_size_XL = amount_size_XL;
					product.main_des = main_des;
					product.general_des = general_des;
					product.detail_des = detail_des;

					// isHot = 0: false, isHot = 1: true
					if (isHot === '0') {
						product.isHot = false;
					}

					if (isHot === '1') {
						product.isHot = true;
					}

					if (trending === '0') {
						product.trending = false;
					}

					if (trending === '1') {
						product.trending = true;
					}

					const saveProduct = await product.save();

					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message: 'Cập nhật sản phẩm thành công!',
							data: saveProduct,
						})
					);
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
						message: 'Sản phẩm không tồn tại!',
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
	// [GET] ==> /product/get-all-product
	getAllProduct: async (req: Request, res: Response) => {
		try {
			// category: 0 => all, 1: Áo len, 2: Quần Jeans, 3: Áo Phông
			// status: 0 => all, 1: isHot = true, 2: Đang sale: sale > 0, 3: trending = true
			// priceMin <= price <= priceMax
			// keyword, limit, page,

			var listProduct: any;
			var countProduct;

			const {category, status, priceMin, priceMax, keyword, limit, page} =
				req.query;

			if (category === '0' && status === '0') {
				// Lấy danh sách tất cả sản phẩm
				listProduct = await ProductModel.find({
					$or: [
						{
							name: {$regex: keyword, $options: '$i'},
						},
					],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
				})
					.skip(Number(page) * Number(limit) - Number(limit))
					.limit(Number(limit));

				// Lấy số lượng
				countProduct = await ProductModel.countDocuments({
					// $or: [
					// 	{
					// 		name: {$regex: keyword, $options: '$i'},
					// 	},
					// ],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
				});
			} else if (category === '0' && status === '1') {
				// Lấy danh sách tất cả sản phẩm
				listProduct = await ProductModel.find({
					$or: [
						{
							name: {$regex: keyword, $options: '$i'},
						},
					],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
					isHot: true,
				})
					.skip(Number(page) * Number(limit) - Number(limit))
					.limit(Number(limit));

				// Lấy số lượng
				countProduct = await ProductModel.countDocuments({
					// $or: [
					// 	{
					// 		name: {$regex: keyword, $options: '$i'},
					// 	},
					// ],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
					isHot: true,
				});
			} else if (category === '0' && status === '2') {
				// Lấy danh sách tất cả sản phẩm
				listProduct = await ProductModel.find({
					$or: [
						{
							name: {$regex: keyword, $options: '$i'},
						},
					],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
					sale: {
						$gte: 1,
						$lte: 100,
					},
				})
					.skip(Number(page) * Number(limit) - Number(limit))
					.limit(Number(limit));

				// Lấy số lượng
				countProduct = await ProductModel.countDocuments({
					// $or: [
					// 	{
					// 		name: {$regex: keyword, $options: '$i'},
					// 	},
					// ],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
					sale: {
						$gte: 1,
						$lte: 100,
					},
				});
			} else if (category === '0' && status === '3') {
				// Lấy danh sách tất cả sản phẩm
				listProduct = await ProductModel.find({
					$or: [
						{
							name: {$regex: keyword, $options: '$i'},
						},
					],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
					trending: true,
				})
					.skip(Number(page) * Number(limit) - Number(limit))
					.limit(Number(limit));

				// Lấy số lượng
				countProduct = await ProductModel.countDocuments({
					// $or: [
					// 	{
					// 		name: {$regex: keyword, $options: '$i'},
					// 	},
					// ],
					price: {
						$gte: priceMin,
						$lte: priceMax,
					},
					trending: true,
				});
			} else {
				// Lấy tất cả sản phẩm theo thể loại
				if (status === '0') {
					// Lấy danh sách tất cả sản phẩm
					listProduct = await ProductModel.find({
						$or: [
							{
								name: {$regex: keyword, $options: '$i'},
							},
						],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
					})
						.skip(Number(page) * Number(limit) - Number(limit))
						.limit(Number(limit));

					// Lấy số lượng
					countProduct = await ProductModel.countDocuments({
						// $or: [
						// 	{
						// 		name: {$regex: keyword, $options: '$i'},
						// 	},
						// ],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
					});
				}

				// Lấy sản phẩm đang hot
				if (status === '1') {
					// Lấy danh sách tất cả sản phẩm
					listProduct = await ProductModel.find({
						$or: [
							{
								name: {$regex: keyword, $options: '$i'},
							},
						],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
						isHot: true,
					})
						.skip(Number(page) * Number(limit) - Number(limit))
						.limit(Number(limit));

					// Lấy số lượng
					countProduct = await ProductModel.countDocuments({
						// $or: [
						// 	{
						// 		name: {$regex: keyword, $options: '$i'},
						// 	},
						// ],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
						isHot: true,
					});
				}

				// Lấy sản phẩm đang sale
				if (status === '2') {
					// Lấy danh sách tất cả sản phẩm
					listProduct = await ProductModel.find({
						$or: [
							{
								name: {$regex: keyword, $options: '$i'},
							},
						],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
						sale: {
							$gte: 1,
							$lte: 100,
						},
					})
						.skip(Number(page) * Number(limit) - Number(limit))
						.limit(Number(limit));

					// Lấy số lượng
					countProduct = await ProductModel.countDocuments({
						// $or: [
						// 	{
						// 		name: {$regex: keyword, $options: '$i'},
						// 	},
						// ],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
						sale: {
							$gte: 1,
							$lte: 100,
						},
					});
				}

				// Lấy sản phẩm đang treding
				if (status === '3') {
					// Lấy danh sách tất cả sản phẩm
					listProduct = await ProductModel.find({
						$or: [
							{
								name: {$regex: keyword, $options: '$i'},
							},
						],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
						trending: true,
					})
						.skip(Number(page) * Number(limit) - Number(limit))
						.limit(Number(limit));

					// Lấy số lượng
					countProduct = await ProductModel.countDocuments({
						// $or: [
						// 	{
						// 		name: {$regex: keyword, $options: '$i'},
						// 	},
						// ],
						price: {
							$gte: priceMin,
							$lte: priceMax,
						},
						category: Number(category),
						trending: true,
					});
				}
			}

			if (listProduct?.length > 0) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Lấy sản phẩm thành công!',
						data: {listProduct, countProduct},
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 1,
						message: 'Danh sách sản phẩm trống!',
						data: {listProduct, countProduct},
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
	// [GET] ==> /product/get-detail-product
	getDetailProduct: async (req: Request, res: Response) => {
		try {
			const idProduct = req.params.id;

			const user = await ProductModel.findById(idProduct);

			if (user) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Lấy chi tiết sản phẩm thành công!',
						data: user,
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Sản phẩm không tồn tại!',
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

	// [POST] ==> /product/create-review
	createReview: async (req: Request, res: Response) => {
		try {
			const {idUser, idProduct, numberStart, content} = req.body;

			if (idUser && idProduct && numberStart && content) {
				// Check user
				const checkUser = await UserModel.findById(idUser);

				if (checkUser) {
					const checkProduct = await ProductModel.findById(idProduct);

					if (checkProduct) {
						// Lấy danh sách đánh giá cũ
						const listReview = checkProduct.reviews;

						// Tạo đánh giá mời
						const newReview = {
							id: uuidv4(),
							idUser: idUser,
							nameUser: checkUser.name,
							numberStar: Number(numberStart),
							content: content,
						};

						// Thêm vào danh sách
						listReview.push(newReview);

						// Lưu đánh giá vào db
						const saveReview = await ProductModel.updateOne(
							{
								_id: idProduct,
							},
							{
								$set: {
									reviews: listReview,
								},
							}
						);

						if (saveReview) {
							const product = await ProductModel.findById(
								idProduct
							);

							// Tinh trung binh sao
							const starTB =
								product?.reviews.reduce(
									(a, v: any) =>
										Number(a) + Number(v.numberStar),
									0
								) / Number(product?.reviews.length);

							// Lưu đánh giá vào db
							const updateStarTB = await ProductModel.updateOne(
								{
									_id: idProduct,
								},
								{
									$set: {
										star: starTB,
									},
								}
							);

							const viewProduct = await ProductModel.findById(
								idProduct
							);

							if (updateStarTB) {
								return res.status(200).json(
									resultData({
										code: 200,
										status: 1,
										message:
											'Đánh giá sản phẩm thành công!',
										data: viewProduct,
									})
								);
							}
						}
					} else {
						return res.status(201).json(
							resultData({
								code: 201,
								status: 0,
								message: 'Sản phẩm không tồn tại!',
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
						message: 'Nhập đầy đủ thông tin!',
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

	// [POST] ==> /product/create-review
	addAmount: async (req: Request, res: Response) => {
		try {
			const {
				idProduct,
				amount_size_S,
				amount_size_M,
				amount_size_L,
				amount_size_XL,
			} = req.body;

			// Check product
			const checkProduct = await ProductModel.findById(idProduct);

			if (checkProduct) {
				// Lấy ra số lượng cũ
				const amount_S = checkProduct.amount_size_S;
				const amount_M = checkProduct.amount_size_M;
				const amount_L = checkProduct.amount_size_L;
				const amount_XL = checkProduct.amount_size_XL;

				// Save database
				const saveProduct = await ProductModel.updateOne(
					{
						_id: idProduct,
					},
					{
						$set: {
							amount_size_S:
								Number(amount_S) + Number(amount_size_S),
							amount_size_M:
								Number(amount_M) + Number(amount_size_M),
							amount_size_L:
								Number(amount_L) + Number(amount_size_L),
							amount_size_XL:
								Number(amount_XL) + Number(amount_size_XL),
						},
					}
				);

				if (saveProduct) {
					const showProduct = await ProductModel.findById(idProduct);

					if (showProduct) {
						return res.status(200).json(
							resultData({
								code: 200,
								status: 1,
								message: 'Thêm số lượng sản phẩm thành công!',
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
						message: 'Sản phẩm không tồn tại!',
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

export default ProductController;
