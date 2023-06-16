import { Product } from '@prisma/client';
import { prisma } from 'config/database';
import { stripe } from 'config/stripe';
import { ForbiddenError, NotFoundError, UnauthorizedError } from 'errors';
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
}

async function createStripeSale(userId: number, products: ProductSaleSubset[]) {
	const productsIds = products.map((product) => product.id);
	const foundProducts = await productsRepository.findProductsByIds(
		productsIds
	);

	checkIfUserOwnsProduct(userId, foundProducts);

	const formattedStripeProducts = foundProducts.map((product) => ({
		price_data: {
			currency: 'brl',
			product_data: {
				name: product.name,
			},
			unit_amount: Number(product.price) * 100,
		},
		quantity: products.find((p) => p.id === product.id)?.quantity || 0,
	}));

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: formattedStripeProducts,
		mode: 'payment',
		success_url: `${process.env.CLIENT_URL}/products`,
		cancel_url: `${process.env.CLIENT_URL}/products`,
		locale: 'pt-BR',
	});

	const { url } = session;

	return url;
}

export const salesService = { createManualSale, createStripeSale };

function checkIfUserOwnsProduct(userId: number, products: Product[]) {
	for (const product of products) {
		if (product.userId !== userId) {
			throw ForbiddenError('You do not own this product');
		}
	}
}

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
