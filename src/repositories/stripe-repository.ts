import { prisma } from 'config/database';
import { stripe } from 'config/stripe';

async function saveStripeAccount(userId: number, stripeAccountId: string) {
	return await prisma.user.update({
		data: { stripeAccountId },
		where: { id: userId },
	});
}

async function createNewAccount(
	email: string,
	first_name: string,
	last_name: string
) {
	return await stripe.accounts.create({
		type: 'express',
		email,
		individual: {
			email,
			first_name,
			last_name,
		},
		capabilities: {
			card_payments: { requested: true },
			transfers: { requested: true },
		},

		country: 'BR',
		default_currency: 'brl',

		business_type: 'individual',

		settings: {
			payouts: {
				schedule: {
					interval: 'daily',
				},
			},
		},
	});
}

async function createUpdateAccountLink(stripeAccountId: string) {
	return await stripe.accountLinks.create({
		account: stripeAccountId,
		refresh_url: `${process.env.CLIENT_URL}/refresh`,
		return_url: `${process.env.CLIENT_URL}/products`,
		type: 'account_onboarding',
	});
}

export const stripeRepository = {
	saveStripeAccount,
	createNewAccount,
	createUpdateAccountLink,
};
