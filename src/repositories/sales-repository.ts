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

async function getUserSales(userId: number) {
	const sales = await prisma.sale.findMany({
		where: {
			userId,
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
	return sales;
}

async function handleCreateSaleTransaction(
	userId: number,
	products: ProductApiSubset[],
	totalPrice: number
) {
	await prisma
		.$transaction(async (prisma) => {
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
					status: 'PAID',
					method: 'CASH',
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

			return { sale };
		})
		.then()
		.catch(console.error);
}

export const salesRepository = {
	createManualSale,
	addProductsToSale,
	handleCreateSaleTransaction,
	getUserSales,
};
