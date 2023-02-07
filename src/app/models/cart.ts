import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartSchema = new Schema(
	{
		idUser: {
			type: String,
			require: true,
		},
		nameUser: {
			type: String,
			require: true,
		},
		idProduct: {
			type: String,
			require: true,
		},
		nameProduct: {
			type: String,
			require: true,
		},
		size: {
			type: String,
			require: true,
		},
		price: {
			type: Number,
			require: true,
		},
		amount: {
			type: Number,
			require: true,
		},
		sale: {
			type: Number,
			require: true,
		},
		totalPrice: {
			type: Number,
			require: true,
		},
		image: {
			type: String,
			require: true,
		},
	},
	{timestamps: true}
);

export default mongoose.model('tb_Cart', cartSchema);
