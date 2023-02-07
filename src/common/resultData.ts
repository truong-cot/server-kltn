interface TypeResultData {
	code: number;
	status: number;
	message: string;
	data: any;
}

export default function resultData({
	code = 200,
	status,
	message = '',
	data = null,
}: TypeResultData) {
	return {
		code,
		status,
		message,
		data,
	};
}
