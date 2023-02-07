import {Request, Response} from 'express';
import resultData from '../../common/resultData';

const HomeController = {
	// [GET] => home
	home: async (req: Request, res: Response) => {
		try {
			return res.json({
				message: 'Chào mừng bạn đến với API khóa luận tốt nghiệp!!!',
			});
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

export default HomeController;
