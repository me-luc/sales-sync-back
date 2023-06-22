import { PaymentStatus, Product } from '@prisma/client';
import { stripe } from 'config/stripe';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { ForbiddenError, NotFoundError } from 'errors';
import { productsRepository, salesRepository } from 'repositories';
import { userRepository } from 'repositories/user-repository';
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
		totalPrice,
		'PAID',
		'CASH'
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

async function getPaymentLink(userId: number, products: ProductSaleSubset[]) {
	const productsIds = products.map((product) => product.id);
	const foundProducts = await productsRepository.findProductsByIds(
		productsIds
	);

	if (foundProducts.length !== productsIds.length)
		throw NotFoundError('Some products were not found');

	checkIfUserOwnsProduct(userId, foundProducts);
	checkProductsAvailability(foundProducts, products);

	const formattedStripeProducts = formatProductsForStripe(
		foundProducts,
		products
	);

	const totalPrice = formattedStripeProducts.reduce(
		(acc, curr) => acc + curr.price_data.unit_amount * curr.quantity,
		0
	);

	if (formattedStripeProducts.length === 0)
		throw NotFoundError('No products available');

	const user = await userRepository.getUserById(userId);

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		mode: 'payment',
		line_items: formattedStripeProducts,
		payment_intent_data: {
			application_fee_amount: totalPrice * 0.05,
			transfer_data: {
				destination: user.stripeAccountId,
			},
			on_behalf_of: user.stripeAccountId,
		},
		success_url: `${process.env.CLIENT_URL}/products`,
		cancel_url: `${process.env.CLIENT_URL}/products`,
		locale: 'pt-BR',
		expires_at: dayjs().add(30, 'minutes').unix(),
	});

	const productsArray = createProductsArray(foundProducts, products);

	const sale = await salesRepository.handleCreateSaleTransaction(
		userId,
		productsArray,
		totalPrice,
		'PENDING',
		'CARD'
	);

	await salesRepository.updatePaymentStripeId(sale.id, session.id);

	const { url } = session;

	return url;
}

async function updateSaleStatus(
	stripePaymentId: string,
	status: PaymentStatus
) {
	const sale = await salesRepository.getPaymentByStripeId(stripePaymentId);
	if (!sale) throw NotFoundError('Sale not found');
	await salesRepository.updatePaymentStatus(sale.id, status);
}

export const salesService = {
	createManualSale,
	createStripeSale,
	getUserSales,
	getPaymentLink,
	updateSaleStatus,
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

function checkProductsAvailability(
	products: Product[],
	saleProducts: ProductSaleSubset[]
) {
	for (const product of products) {
		const saleProduct = saleProducts.find((p) => p.id === product.id);
		if (product.quantity < saleProduct.quantity || product.quantity === 0)
			throw NotFoundError('Product out of stock');

		if (product.deletedAt !== null)
			throw NotFoundError('Product has been deleted');
	}
}

function createProductsArray(
	products: Product[],
	saleProducts: ProductSaleSubset[]
) {
	const productsArray: ProductApiSubset[] = [];
	products.map((product) => {
		const saleProduct = saleProducts.find((p) => p.id === product.id);
		productsArray.push({
			...product,
			quantity: saleProduct.quantity,
		});
	});
	return productsArray;
}

function formatProductsForStripe(
	products: Product[],
	saleProducts: ProductSaleSubset[]
) {
	const formattedStripeProducts = products.map((product) => ({
		price_data: {
			currency: 'brl',
			product_data: {
				name: product.name,
			},
			unit_amount: Number(product.price) * 100,
		},
		quantity: saleProducts.find((p) => p.id === product.id)?.quantity || 0,
	}));
	return formattedStripeProducts;
}

// function registerProductsOnStripe(products: Product[]) {
// 	for (const product of products) {
// 	}
// }
