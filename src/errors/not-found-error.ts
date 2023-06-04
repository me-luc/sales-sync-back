export function NotFoundError(message: string = 'Not found') {
	return {
		name: 'NotFoundError',
		message,
	};
}
