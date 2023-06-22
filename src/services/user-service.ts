import { NotFoundError } from 'errors';
import { userRepository } from 'repositories/user-repository';

function getUserById(id: number) {
	const user = userRepository.getUserById(id);

	if (!user) {
		throw NotFoundError('User not found');
	}

	return user;
}

export const userService = { getUserById };
