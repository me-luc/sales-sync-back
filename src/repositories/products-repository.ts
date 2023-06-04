import { prisma } from '../config/database';
import { ProductCreateSubset, ProductUpdateSubset } from '../types/';

async function createProduct(userId: number, product: ProductCreateSubset) {
	console.log('createProduct', product);
	return await prisma.product.create({
		data: { ...product, userId },
	});
}

async function getProductsByUserId(userId: number) {
	return await prisma.product.findMany({
		where: {
			userId,
		},
	});
}

async function getProductById(id: number) {
	return await prisma.product.findUnique({
		where: {
			id,
		},
	});
}

async function updateProduct(product: ProductUpdateSubset) {
	return await prisma.product.update({
		where: {
			id: product.id,
		},
		data: {
			...product,
		},
	});
}

async function deleteProductById(id: number) {
	return await prisma.product.delete({
		where: {
			id,
		},
	});
}

export const productsRepository = {
	createProduct,
	getProductsByUserId,
	getProductById,
	updateProduct,
	deleteProductById,
};
