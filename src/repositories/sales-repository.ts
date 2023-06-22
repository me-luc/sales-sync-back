import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { prisma } from 'config/database';
import { ProductApiSubset } from 'types';

async function createManualSale(userId: number) {
	const sale = await prisma.sale.create({
		data: {
			userId,
		},
	});
	return sale;
}

async function addProductsToSale(products: ProductApiSubset[], saleId: number) {
	await prisma.saleProducts.createMany({
		data: products.map((product) => ({
			productId: product.id,
			quantity: product.quantity,
			price: product.price,
			saleId,
		})),
	});
}

async function updatePaymentStripeId(saleId: number, paymentStripeId: string) {
	await prisma.payment.update({
		where: {
			saleId,
		},
		data: {
			stripeId: paymentStripeId,
		},
	});
}

async function updatePaymentStatus(saleId: number, status: PaymentStatus) {
	await prisma.payment.update({
		where: {
			saleId,
		},
		data: {
			status,
		},
	});
}

async function getUserSales(userId: number) {
	return await prisma.sale.findMany({
		where: {
			userId,
			payment: {
				status: 'PAID',
			},
		},
		include: {
			saleProducts: {
				include: {
					product: true,
				},
			},
			payment: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
}

async function handleCreateSaleTransaction(
	userId: number,
	products: ProductApiSubset[],
	totalPrice: number,
	status: PaymentStatus,
	method: PaymentMethod
) {
	return await prisma.$transaction(async (prisma) => {
		const sale = await prisma.sale.create({
			data: {
				userId,
			},
		});

		const saleProducts = products.map((product) => ({
			productId: product.id,
			quantity: product.quantity,
			price: product.price,
			saleId: sale.id,
		}));

		await prisma.saleProducts.createMany({
			data: saleProducts,
		});

		await prisma.payment.create({
			data: {
				amount: totalPrice,
				status,
				method,
				saleId: sale.id,
			},
		});

		for (const product of saleProducts) {
			const foundProduct = await prisma.product.findUnique({
				where: {
					id: product.productId,
				},
			});

			if (foundProduct) {
				await prisma.product.update({
					where: {
						id: foundProduct.id,
					},
					data: {
						quantity: foundProduct.quantity - product.quantity,
					},
				});
			}
		}

		return sale;
	});
}

async function getPaymentByStripeId(stripeId: string) {
	return await prisma.payment.findUnique({
		where: {
			stripeId,
		},
	});
}

export const salesRepository = {
	createManualSale,
	addProductsToSale,
	handleCreateSaleTransaction,
	getUserSales,
	updatePaymentStripeId,
	updatePaymentStatus,
	getPaymentByStripeId,
};
