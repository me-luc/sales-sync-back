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
		type: 'standard',
		email,
		business_type: 'individual',
		individual: {
			email,
			first_name,
			last_name,
		},
		business_profile: {
			name: first_name + ' Store',
		},
		// default_currency: 'BRL',
		// external_account: {
		// 	object: 'bank_account',
		// 	country: 'BR',
		// 	currency: 'BRL',
		// 	account_holder_name: first_name + ' ' + last_name,
		// 	account_holder_type: 'individual',
		// 	routing_number: '260-0001',
		// 	account_number: '0001234',
		// },
	});
}

async function createUpdateAccountLink(stripeAccountId: string) {
	return await stripe.accountLinks.create({
		account: stripeAccountId,
		refresh_url: `${process.env.CLIENT_URL}/refresh`,
		return_url: `${process.env.CLIENT_URL}/profile`,
		type: 'account_onboarding',
	});
}

export const stripeRepository = {
	saveStripeAccount,
	createNewAccount,
	createUpdateAccountLink,
};
