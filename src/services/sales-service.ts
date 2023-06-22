import { Product } from '@prisma/client';
import { stripe } from 'config/stripe';
import dayjs, { locale } from 'dayjs';
import 'dayjs/locale/pt-br';
import { ForbiddenError, NotFoundError } from 'errors';
import { productsRepository, salesRepository } from 'repositories';
import { ProductApiSubset, ProductSaleSubset } from 'types';

async function createManualSale(userId: number, products: ProductSaleSubset[]) {
	const productsIds = products.map((product) => product.id);
	const foundProducts = await productsRepository.findProductsByIds(
		productsIds
	);

	if (!foundProducts.length) throw NotFoundError('Products not found');
	checkIfUserOwnsProduct(userId, foundProducts);

	let totalPrice = 0;
	const productsArray: ProductApiSubset[] = [];

	for (const product of foundProducts) {
		const saleProduct = products.find((p) => p.id === product.id);
		checkIfProductExists(product);
		checkProductStock(product, saleProduct.quantity);
		totalPrice += Number(product.price) * saleProduct.quantity;
		productsArray.push({
			...product,
			quantity: saleProduct.quantity,
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

async function createStripeSeparateSale(
	userId: number,
	products: ProductSaleSubset[]
) {
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

async function getUserSales(userId: number) {
	const products = await salesRepository.getUserSales(userId);
	const salesPerDate = products.map((sale) => ({
		id: sale.id,
		date: dayjs(sale.createdAt)
			.locale('pt-br')
			.format('DD [de] MMM [de] YYYY'),
		saleProducts: sale.saleProducts.map((product) => ({
			id: product.productId,
			quantity: product.quantity,
			price: Number(product.price),
			photo: product.product.photo,
			name: product.product.name,
		})),
		paymentMethod: translatePaymentMethod(sale.payment.method),
		totalPrice: Number(sale.payment.amount),
	}));
	return salesPerDate;
}

export const salesService = {
	createManualSale,
	createStripeSale,
	getUserSales,
};

function checkIfUserOwnsProduct(userId: number, products: Product[]) {
	for (const product of products) {
		if (product.userId !== userId) {
			throw ForbiddenError('You do not own this product');
		}
	}
}

function checkProductStock(product: Product, requestedQuantity: number) {
	if (product.quantity < requestedQuantity || product.quantity === 0)
		throw NotFoundError('Product out of stock');
}

function checkIfProductExists(product: Product) {
	if (product.deletedAt !== null) throw NotFoundError('Product not found');
}

function translatePaymentMethod(method: string) {
	switch (method) {
		case 'CASH':
			return 'Dinheiro';
		case 'CARD':
			return 'Cartão de crédito';
	}
}
