import { ApplicationError } from '../types';

export default function InvalidCredentialsError(): ApplicationError {
	return {
		name: 'InvalidCredentialsError',
		message: 'Invalid Credentials!',
	};
}
