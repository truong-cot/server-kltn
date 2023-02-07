import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Use dotenv
dotenv.config();

async function connect() {
	try {
		await mongoose.connect(String(process.env.MONGODB_URL));
		console.log('Connect db successfuly !!!');
	} catch (error) {
		console.log('Connect db failure !!!');
	}
}

export default connect;
