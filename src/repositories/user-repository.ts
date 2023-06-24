import { prisma } from 'config/database';

async function getUserById(id: number) {
	return await prisma.user.findUnique({ where: { id } });
}

async function getUserByStripeAccountId(stripeAccountId: string) {
	return await prisma.user.findUnique({
		where: { stripeAccountId },
	});
}

async function updateUserStripeAccountStatus(id: number, active: boolean) {
	return await prisma.user.update({
		data: { stripeCompletedProfile: active },
		where: { id },
	});
}

export const userRepository = {
	getUserById,
	updateUserStripeAccountStatus,
	getUserByStripeAccountId,
};
