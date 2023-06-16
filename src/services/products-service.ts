import { ForbiddenError } from '../errors';
import { NotFoundError } from '../errors/not-found-error';
import { productsRepository } from '../repositories';
import { ProductCreateSubset, ProductUpdateSubset } from '../types';
import { filesService } from './files-service';

async function createProduct(userId: number, product: ProductCreateSubset) {
	const newProduct = await productsRepository.createProduct(userId, product);
	return newProduct;
}

async function deleteProduct(productId: number, userId: number) {
	const product = await checkIfUserOwnsProduct(userId, productId);
	await productsRepository.deleteProductById(productId);
	await filesService.deleteProductPhoto(product.photo, productId);
}

async function updateProduct(userId: number, product: ProductUpdateSubset) {
	await checkIfUserOwnsProduct(userId, product.id);
	await productsRepository.updateProduct(product);
}

async function getProductsByUser(userId: number) {
	const products = await productsRepository.getProductsByUserId(userId);
	return products;
}

async function updateProductPhoto(productId: number, photo: string) {
	if (photo) await productsRepository.updateProductPhoto(productId, photo);
}

export const productsService = {
	createProduct,
	deleteProduct,
	updateProduct,
	getProductsByUser,
	updateProductPhoto,
};

async function checkIfUserOwnsProduct(userId: number, productId: number) {
	const product = await productsRepository.getProductById(productId);
	if (!product) throw NotFoundError('Product not found');

	if (product.userId !== userId) {
		throw ForbiddenError('You need permission to access this product');
	}

	return product;
}
