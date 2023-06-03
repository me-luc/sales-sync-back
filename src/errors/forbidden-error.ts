import { ApplicationError } from '../types';

export function ForbiddenError(
	message: string = 'Forbidden'
): ApplicationError {
	return {
		name: 'ForbiddenError',
		message,
	};
}
