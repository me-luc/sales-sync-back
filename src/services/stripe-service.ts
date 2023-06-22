import { stripe } from 'config/stripe';
import { stripeRepository } from 'repositories/stripe-repository';
import { userRepository } from 'repositories/user-repository';

async function createNewAccount(userId: number, email: string, name: string) {
	const { firstName, lastName } = splitName(name);

	const user = await userRepository.getUserById(userId);

	if (user.stripeAccountId) {
		const account = await stripe.accounts.retrieve(user.stripeAccountId);
		return account;
	}

	const account = await stripeRepository.createNewAccount(
		email,
		firstName,
		lastName
	);

	await stripeRepository.saveStripeAccount(userId, account.id);
	return account;
}

async function getUpdateAccountLink(stripeAccountId: string) {
	const accountLink = await stripeRepository.createUpdateAccountLink(
		stripeAccountId
	);

	return accountLink.url;
}

export const stripeService = { createNewAccount, getUpdateAccountLink };

function splitName(name: string) {
	const [firstName, ...rest] = name.split(' ');
	const lastName = rest.join(' ');

	return { firstName, lastName };
}
