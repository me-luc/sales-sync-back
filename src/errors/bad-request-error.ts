export default function BadRequestError(
	message: string = 'Bad Request'
): ApplicationError {
	return {
		name: 'BadRequestError',
		message,
	};
}
