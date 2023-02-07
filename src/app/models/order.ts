import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface TypeProduct {
	idProduct: String;
	nameProduct: String;
	size: Number;
	price: Number;
	sale: Number;
	amount: Number;
	orderPrice: Number;
	image: String;
}

const orderSchema = new Schema(
	{
		idUser: {
			type: String,
			require: true,
		},
		// Tên người dùng
		nameUser: {
			type: String,
			require: true,
		},
		// Tên người nhận hàng
		nameReceiver: {
			type: String,
			require: true,
		},
		phone: {
			type: Number,
			require: true,
		},
		address: {
			type: String,
			require: true,
		},
		// 1: GHTK, 2: GHN, 3: GHTN
		shippingMethod: {
			type: Number,
			require: true,
		},
		// Phí vận chuyển
		transportFee: {
			type: Number,
			require: true,
		},
		note: {
			type: String,
			require: true,
		},
		// Danh sách sản phẩm
		products: {
			type: Array<TypeProduct>,
			require: true,
		},
		totalPrice: {
			type: Number,
			require: true,
		},
		// Trạng thái đơn hàng: 0: Chờ xác nhận, 1: Đã xác nhận và đang giao, 2: Giao thành công, 3: Đã hủy
		statusOrder: {
			type: Number,
			require: true,
			default: 0,
		},
	},
	{timestamps: true}
);

export default mongoose.model('tb_Order', orderSchema);
