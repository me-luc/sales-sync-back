import { ApplicationError } from '../types';

export function UnauthorizedError(
	message: string = 'Unauthorized'
): ApplicationError {
	return {
		name: 'UnauthorizedError',
		message,
	};
}
