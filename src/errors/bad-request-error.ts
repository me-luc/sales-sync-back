import { ApplicationError } from '../types';

export function BadRequestError(
	message: string = 'Bad Request'
): ApplicationError {
	return {
		name: 'BadRequestError',
		message,
	};
}
