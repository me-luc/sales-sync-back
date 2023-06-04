import { prisma } from '../config/database';
import { ForbiddenError } from '../errors';
import { NotFoundError } from '../errors/not-found-error';
import { productsRepository } from '../repositories';
import { ProductCreateSubset, ProductUpdateSubset } from '../types';

async function createProduct(userId: number, product: ProductCreateSubset) {
	await productsRepository.createProduct(userId, product);
}

async function deleteProduct(productId: number, userId: number) {
	await checkIfUserOwnsProduct(productId, userId);
	await productsRepository.deleteProductById(productId);
}

async function updateProduct(userId: number, product: ProductUpdateSubset) {
	await checkIfUserOwnsProduct(userId, product.id);
	await productsRepository.updateProduct(product);
}

async function getProductsByUser(userId: number) {
	const products = await productsRepository.getProductsByUserId(userId);
	return products;
}

export const productsService = {
	createProduct,
	deleteProduct,
	updateProduct,
	getProductsByUser,
};

async function checkIfUserOwnsProduct(userId: number, productId: number) {
	const product = await productsRepository.getProductById(productId);
	if (!product) throw NotFoundError('Product not found');

	if (product.userId !== userId) {
		throw ForbiddenError('You need permission to access this product');
	}
}
