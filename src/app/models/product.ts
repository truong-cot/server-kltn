import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		price: {
			type: Number,
			require: true,
		},
		// 1: Áo len, 2: Quần Jeans, 3: Áo Phông
		category: {
			type: Number,
			require: true,
		},
		sale: {
			type: Number,
			default: 0,
			require: true,
		},
		images: {
			type: Array,
			require: true,
			default: [],
		},
		// // Danh sách size
		// sizes: {
		// 	type: Array,
		// 	require: true,
		// 	default: [
		// 		{
		// 			id: 1,
		// 			value: 'S',
		// 			amount: 0,
		// 		},
		// 		{
		// 			id: 2,
		// 			value: 'M',
		// 			amount: 0,
		// 		},
		// 		{
		// 			id: 3,
		// 			value: 'L',
		// 			amount: 0,
		// 		},
		// 		{
		// 			id: 1,
		// 			value: 'XL',
		// 			amount: 0,
		// 		},
		// 	],
		// },
		amount_size_S: {
			type: Number,
			require: true,
		},
		amount_size_M: {
			type: Number,
			require: true,
		},
		amount_size_L: {
			type: Number,
			require: true,
		},
		amount_size_XL: {
			type: Number,
			require: true,
		},
		main_des: {
			type: String,
			require: true,
		},
		general_des: {
			type: String,
			require: true,
		},
		detail_des: {
			type: String,
			require: true,
		},
		isHot: {
			type: Boolean,
			default: true,
		},
		trending: {
			type: Boolean,
			default: true,
		},
		star: {
			type: Number,
			default: 0,
		},
		reviews: {
			type: Array<any>,
			default: [],
		},
	},
	{timestamps: true}
);

export default mongoose.model('tb_Product', productSchema);
