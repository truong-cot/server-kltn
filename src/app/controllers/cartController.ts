import {Request, Response} from 'express';
import resultData from '../../common/resultData';
import cartSchema from '../models/cart';
import productSchema from '../models/product';
import userSchema from '../models/user';

const CartController = {
	// [POST] => /cart/add-to-cart (Thêm đơn hàng vào giỏ hàng)
	addToCart: async (req: Request, res: Response) => {
		try {
			const {idUser, idProduct, price, sale, amount, size} = req.body;

			if (idUser && idProduct && price && sale && amount && size) {
				// Tìm user
				const checkUser = await userSchema.findById(idUser);
				if (checkUser) {
					// Tìm product
					const checkProduct = await productSchema.findById(
						idProduct
					);
					if (checkProduct) {
						// Tìm sản phẩm trong giỏ hàng
						const checkCart = await cartSchema.findOne({
							idProduct: idProduct,
							idUser: idUser,
							size: size,
						});

						var newAmount;
						var totalPrice;

						// Trường hợp sản phẩm đã tồn tại sản phẩm trong giỏ hàng
						if (checkCart) {
							// Tăng số lượng
							newAmount =
								Number(checkCart.amount) + Number(amount);

							// Tính tổng tiền trong giỏ hàng
							totalPrice =
								(Number(price) -
									(Number(price) * Number(sale)) / 100) *
								Number(newAmount);
						} else {
							// Trường hợp sản phẩm chưa tồn tại sản phẩm trong giỏ hàng
							// Tăng số lượng
							newAmount = Number(amount);

							// Tính tổng tiền trong giỏ hàng
							totalPrice =
								(Number(price) -
									(Number(price) * Number(sale)) / 100) *
								Number(newAmount);
						}
						// Xóa đơn hàng trước
						const deleteCart = await cartSchema.findOneAndDelete({
							idProduct: idProduct,
							idUser: idUser,
							size: size,
						});

						if (deleteCart) {
							// Lưu vào db
							const newCart = new cartSchema({
								idUser: idUser,
								nameUser: checkUser.name,
								idProduct: idProduct,
								size: size,
								nameProduct: checkProduct.name,
								image: checkProduct?.images[0]?.url,
								price: price,
								amount: newAmount,
								sale: sale,
								totalPrice: totalPrice,
							});

							const saveCart = await newCart.save();

							return res.status(200).json(
								resultData({
									code: 200,
									status: 1,
									message: `Thêm sản phẩm vào giỏ hàng thành công!`,
									data: saveCart,
								})
							);
						} else {
							// Lưu vào db
							const newCart = new cartSchema({
								idUser: idUser,
								nameUser: checkUser.name,
								idProduct: idProduct,
								size: size,
								nameProduct: checkProduct.name,
								image: checkProduct?.images[0]?.url,
								price: price,
								amount: newAmount,
								sale: sale,
								totalPrice: totalPrice,
							});

							const saveCart = await newCart.save();

							return res.status(200).json(
								resultData({
									code: 200,
									status: 1,
									message: `Thêm sản phẩm vào giỏ hàng thành công!`,
									data: saveCart,
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
	// [GET] => /cart/get-cart?idUser=1234 (Lấy giỏ hàng của người dùng)
	getCartUser: async (req: Request, res: Response) => {
		try {
			const {idUser} = req.query;

			if (idUser) {
				const carts = await cartSchema.find({
					idUser: idUser,
				});

				return res.status(200).json(
					resultData({
						code: 200,
						status: 1,
						message: 'Danh sách giỏ hàng của bạn!',
						data: carts,
					})
				);
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Không tìm người dùng!',
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

	// [DELETE] => /cart/delete-cart?idCart=${data.idCart} (Xóa giỏ hàng của người dùng)
	deleteCartUser: async (req: Request, res: Response) => {
		try {
			const {idCart} = req.query;

			if (idCart) {
				const deleteCart = await cartSchema.findByIdAndDelete(idCart);

				if (deleteCart) {
					return res.status(200).json(
						resultData({
							code: 200,
							status: 1,
							message: 'Xóa giỏ hàng thành công!',
							data: deleteCart,
						})
					);
				}
			} else {
				return res.status(201).json(
					resultData({
						code: 201,
						status: 0,
						message: 'Không tìm thấy giỏ hàng!',
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

export default CartController;
