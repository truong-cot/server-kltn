// import cloudinary_v1 from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// const cloudinary = cloudinary_v1.v2;

// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUDNAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploader = async (file: any, folder: String) => {
// 	return new Promise((resolve) => {
// 		cloudinary.uploader.upload(file, (err: any, data: any) => {
// 			resolve({
// 				url: data.url,
// 				id: data.public_id,
// 			});
// 		});
// 	});
// };

// export default uploader;

import cloudinary_v1 from 'cloudinary';

const cloudinary = cloudinary_v1.v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUDNAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
