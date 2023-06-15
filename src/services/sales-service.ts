import { Product } from '@prisma/client';
import { prisma } from 'config/database';
import { NotFoundError } from 'errors';
import { productsRepository, salesRepository } from 'repositories';
import { paymentRepository } from 'repositories/payments-repository';
import { ProductApiSubset, ProductSaleSubset } from 'types';

async function createManualSale(userId: number, products: ProductSaleSubset[]) {
	let totalPrice = 0;
	const productsArray: ProductApiSubset[] = [];

	for (const product of products) {
		const foundProduct = await checkIfProductExists(product.id);
		checkProductStock(foundProduct, product.quantity);
		totalPrice += Number(foundProduct.price) * product.quantity;
		productsArray.push({
			...foundProduct,
			quantity: product.quantity,
		});
	}

	await salesRepository.handleCreateSaleTransaction(
		userId,
		productsArray,
		totalPrice
	);

	// const newSale = await salesRepository.createManualSale(userId);

	// await salesRepository.addProductsToSale(productsArray, newSale.id);

	// await paymentRepository.createPayment(
	// 	totalPrice,
	// 	'PAID',
	// 	'CASH',
	// 	newSale.id
	// );

	// for (const product of productsArray) {
	// 	const foundProduct = await checkIfProductExists(product.id);
	// 	await productsRepository.updateProduct({
	// 		...product,
	// 		quantity: foundProduct.quantity - product.quantity,
	// 	});
	// }
}

export const salesService = { createManualSale };

function checkProductStock(product: Product, requestedQuantity: number) {
	if (product.quantity < requestedQuantity) {
		throw NotFoundError('Product out of stock');
	}
}

async function checkIfProductExists(id: number) {
	const product = await productsRepository.getProductById(id);
	if (!product) throw NotFoundError('Product not found');
	return product;
}
