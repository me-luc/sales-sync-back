import { ApplicationError } from '../types';

export function InvalidCredentialsError(): ApplicationError {
	return {
		name: 'InvalidCredentialsError',
		message: 'Invalid Credentials!',
	};
}
