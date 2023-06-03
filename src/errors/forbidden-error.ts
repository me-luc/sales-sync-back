import { ApplicationError } from '../types';

export default function ForbiddenError(
	message: string = 'Forbidden'
): ApplicationError {
	return {
		name: 'ForbiddenError',
		message,
	};
}
