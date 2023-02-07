import {Request, Response} from 'express';
import resultData from '../../common/resultData';

import orderSchema from '../../app/models/order';
import productSchema from '../../app/models/product';

interface TypeProduct {
	idProduct: String;
	nameProduct: String;
	size: String;
	price: Number;
	sale: Number;
	amount: Number;
	image: String;
	totalPrice: Number;
}

const orderController = {
	// [POST] => /order/create-order ==> Tạo đơn hàng mới
	createOrder: async (req: Request, res: Response) => {
		try {
			const {
				idUser,
				nameUser,
				nameReceiver,
				phone,
				address,
				shippingMethod,
				note,
			} = req.body;

			const products: Array<TypeProduct> = req.body.products;

			if (
				idUser &&
				nameUser &&
				nameReceiver &&
				phone &&
				address &&
				shippingMethod &&
				note &&
				products
			) {
				// Tính phí vận chuyển
				var transportFee;

				if (shippingMethod === 1) {
					transportFee = 30000;
				}

				if (shippingMethod === 2) {
					transportFee = 40000;
				}

				if (shippingMethod === 3) {
					transportFee = 50000;
				}

				if (
					shippingMethod !== 1 &&
					shippingMethod !== 2 &&
					shippingMethod !== 3
				) {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Phương thức vận chuyển không hợp lệ!',
							data: {},
						})
					);
				}

				// Tính tổng tiền đơn hàng
				var totalPrice = 0;

				for (var product of products) {
					totalPrice =
						Number(totalPrice) + Number(product.totalPrice);
				}

				const newOrder = new orderSchema({
					idUser: idUser,
					nameUser: nameUser,
					nameReceiver: nameReceiver,
					phone: phone,
					address: address,
					note: note,
					shippingMethod: shippingMethod,
					transportFee: transportFee,
					totalPrice: Number(totalPrice) + Number(transportFee),
					statusOrder: 0,
					// Danh sách sản phẩm
					products: products,
				});

				// Lưu đơn hàng vào db
				const saveOrder = await newOrder.save();

				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: `Tạo đơn hàng thành công!`,
						data: saveOrder,
					})
				);
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

	// [PUT] => /order/confirmation-order ==> Xác nhận đơn hàng
	confirmationOrder: async (req: Request, res: Response) => {
		try {
			const {idOrder} = req.body;

			if (idOrder) {
				// Tìm đơn hàng
				const order = await orderSchema.findById(idOrder);

				if (order) {
					// Lấy ra danh sách sản phẩm trong đơn hàng
					const listProduct: any = order.products;

					// Trừ sô lượng theo sản phẩm, size
					for (var product of listProduct) {
						const idProduct = product.idProduct;

						var productModel = await productSchema.findById(
							idProduct
						);

						if (product.size === 'S') {
							const amount_size_S =
								Number(productModel?.amount_size_S) -
								product.amount;

							// Cập nhật lại số lượng
							await productSchema.updateOne(
								{_id: idProduct},
								{
									$set: {
										amount_size_S: amount_size_S,
									},
								}
							);
						}

						if (product.size === 'M') {
							const amount_size_M =
								Number(productModel?.amount_size_M) -
								product.amount;

							// Cập nhật lại số lượng
							await productSchema.updateOne(
								{_id: idProduct},
								{
									$set: {
										amount_size_M: amount_size_M,
									},
								}
							);
						}

						if (product.size === 'L') {
							const amount_size_L =
								Number(productModel?.amount_size_L) -
								product.amount;

							// Cập nhật lại số lượng
							await productSchema.updateOne(
								{_id: idProduct},
								{
									$set: {
										amount_size_L: amount_size_L,
									},
								}
							);
						}

						if (product.size === 'XL') {
							const amount_size_XL =
								Number(productModel?.amount_size_XL) -
								product.amount;

							// Cập nhật lại số lượng
							await productSchema.updateOne(
								{_id: idProduct},
								{
									$set: {
										amount_size_XL: amount_size_XL,
									},
								}
							);
						}
					}

					// Cập nhật lại trạng thái đơn hàng
					const saveOrder = await orderSchema.updateOne(
						{_id: idOrder},
						{
							$set: {
								statusOrder: 1,
							},
						}
					);

					if (saveOrder) {
						return res.status(200).json(
							resultData({
								code: 200,
								status: 1,
								message: 'Xác nhận đơn hàng thành công!',
								data: order,
							})
						);
					}
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Đơn hàng không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Vui lòng nhập ID đơn hàng!',
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

	// [PUT] => /order/cancel-order ==> Hủy đơn hàng
	cancelOrder: async (req: Request, res: Response) => {
		try {
			const {idOrder} = req.body;

			if (idOrder) {
				// Tìm đơn hàng
				const order = await orderSchema.findById(idOrder);

				if (order) {
					if (order.statusOrder === 1) {
						// Lấy ra danh sách sản phẩm trong đơn hàng
						const listProduct: any = order.products;

						// Trừ sô lượng theo sản phẩm, size
						for (var product of listProduct) {
							const idProduct = product.idProduct;

							var productModel = await productSchema.findById(
								idProduct
							);

							if (product.size === 'S') {
								const amount_size_S =
									Number(productModel?.amount_size_S) +
									product.amount;

								// Cập nhật lại số lượng
								await productSchema.updateOne(
									{_id: idProduct},
									{
										$set: {
											amount_size_S: amount_size_S,
										},
									}
								);
							}

							if (product.size === 'M') {
								const amount_size_M =
									Number(productModel?.amount_size_M) +
									product.amount;

								// Cập nhật lại số lượng
								await productSchema.updateOne(
									{_id: idProduct},
									{
										$set: {
											amount_size_M: amount_size_M,
										},
									}
								);
							}

							if (product.size === 'L') {
								const amount_size_L =
									Number(productModel?.amount_size_L) +
									product.amount;

								// Cập nhật lại số lượng
								await productSchema.updateOne(
									{_id: idProduct},
									{
										$set: {
											amount_size_L: amount_size_L,
										},
									}
								);
							}

							if (product.size === 'XL') {
								const amount_size_XL =
									Number(productModel?.amount_size_XL) +
									product.amount;

								// Cập nhật lại số lượng
								await productSchema.updateOne(
									{_id: idProduct},
									{
										$set: {
											amount_size_XL: amount_size_XL,
										},
									}
								);
							}
						}
					}

					// Cập nhật lại trạng thái đơn hàng
					const saveOrder = await orderSchema.updateOne(
						{_id: idOrder},
						{
							$set: {
								statusOrder: 3,
							},
						}
					);

					if (saveOrder) {
						return res.status(200).json(
							resultData({
								code: 200,
								status: 1,
								message: 'Hủy đơn hàng thành công!',
								data: order,
							})
						);
					}
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Đơn hàng không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Vui lòng nhập ID đơn hàng!',
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

	// [POST] => /order/confirmation-delivery ==> Xác nhận đã nhận hàng
	confirmationDelivery: async (req: Request, res: Response) => {
		try {
			const {idOrder} = req.body;

			if (idOrder) {
				// Tìm đơn hàng
				const order = await orderSchema.findById(idOrder);

				if (order) {
					// Cập nhật lại trạng thái đơn hàng
					const saveOrder = await orderSchema.updateOne(
						{_id: idOrder},
						{
							$set: {
								statusOrder: 2,
							},
						}
					);

					if (saveOrder) {
						return res.status(200).json(
							resultData({
								code: 200,
								status: 1,
								message: 'Đơn hàng giao thành công!',
								data: order,
							})
						);
					}
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Đơn hàng không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Vui lòng nhập ID đơn hàng!',
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

	// [GET] => /order/get-detail-order?idOrder=${data.idOrder} ==> Lấy chi tiết đơn hàng
	getDetailOrder: async (req: Request, res: Response) => {
		try {
			const {idOrder} = req.query;

			if (idOrder) {
				// Tìm đơn hàng
				const order = await orderSchema.findById(idOrder);

				if (order) {
					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message: 'Chi tiết đơn hàng!',
							data: order,
						})
					);
				} else {
					return res.status(201).json(
						resultData({
							code: 201,
							status: 0,
							message: 'Đơn hàng không tồn tại!',
							data: {},
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Vui lòng nhập ID đơn hàng!',
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

	// [GET] => /order/get-all-order ==> Lấy tất cả đơn hàng
	getAllOrder: async (req: Request, res: Response) => {
		try {
			// Trạng thái sản phẩm: statusOrder ==> 0: Chờ xác nhận, 1: Đã xác nhận, đang giao, 3: Giao thành công, 4: Đã hủy
			// keyword, limit, page,

			const {statusOrder, keyword, limit, page} = req.query;

			const listOrder = await orderSchema
				.find({
					$or: [
						{
							nameUser: {$regex: keyword, $options: '$i'},
						},
						{
							nameReceiver: {$regex: keyword, $options: '$i'},
						},
					],
					statusOrder: Number(statusOrder),
				})
				.skip(Number(page) * Number(limit) - Number(limit))
				.limit(Number(limit));

			const countOrder = await orderSchema.countDocuments({
				statusOrder: Number(statusOrder),
			});

			if (listOrder) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Tất cả đơn hàng!',
						data: {listOrder, countOrder},
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

	// [GET] => /order/get-order-user ==> Lấy tất cả đơn hàng theo user
	getOrderUser: async (req: Request, res: Response) => {
		try {
			const {idUser} = req.query;

			const listOrder = await orderSchema.find({idUser: idUser});

			if (listOrder) {
				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Tất cả đơn hàng!',
						data: listOrder,
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

export default orderController;
