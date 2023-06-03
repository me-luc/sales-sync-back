import { ApplicationError } from '../types';

export default function UnauthorizedError(
	message: string = 'Unauthorized'
): ApplicationError {
	return {
		name: 'UnauthorizedError',
		message,
	};
}
