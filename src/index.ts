import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import database from '../src/config/database';
import route from './routes';

const app = express();

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Parse ==> json()
app.use(express.json());

// Kết nối database
database();

// Kết nối routes
route(app);

app.listen(process.env.PORT, () => {
	console.log(`Server running http://localhost:${process.env.PORT}`);
});
