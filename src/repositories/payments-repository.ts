import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { prisma } from 'config/database';

async function createPayment(
	amount: number,
	status: PaymentStatus,
	method: PaymentMethod,
	saleId: number
) {
	const newPayment = await prisma.payment.create({
		data: {
			amount,
			status,
			method,
			saleId,
		},
	});
	return newPayment;
}

export const paymentRepository = { createPayment };
