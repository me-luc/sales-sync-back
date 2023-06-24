import { NotFoundError } from 'errors';
import { userRepository } from 'repositories/user-repository';

async function getUserById(id: number) {
	const user = await userRepository.getUserById(id);

	if (!user) {
		throw NotFoundError('User not found');
	}

	return user;
}

async function updateUserStripeAccountStatus(
	stripeAccountId: string,
	active: boolean
) {
	const user = await userRepository.getUserByStripeAccountId(stripeAccountId);

	if (!user) {
		throw NotFoundError('User not found');
	}

	await userRepository.updateUserStripeAccountStatus(user.id, active);
}

export const userService = { getUserById, updateUserStripeAccountStatus };
