import express from 'express';
import HomeController from '../app/controllers/homeController';

const router = express.Router();

router.get('/', HomeController.home);

export default router;
