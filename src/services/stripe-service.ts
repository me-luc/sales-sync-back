import { stripeRepository } from 'repositories/stripe-repository';

async function createNewAccount(userId: number, email: string, name: string) {
	const { firstName, lastName } = splitName(name);

	const account = await stripeRepository.createNewAccount(
		email,
		firstName,
		lastName
	);

	await stripeRepository.saveStripeAccount(userId, account.id);

	return account;
}

async function updateStripeAccount(
	userId: number,
	email: string,
	name: string
) {
	const { firstName, lastName } = splitName(name);
}

export const stripeService = { createNewAccount };

function splitName(name: string) {
	const [firstName, ...rest] = name.split(' ');
	const lastName = rest.join(' ');

	return { firstName, lastName };
}
