import { prisma } from '../config/database';
import { ProductCreateSubset, ProductUpdateSubset } from '../types/';

async function createProduct(userId: number, product: ProductCreateSubset) {
	return await prisma.product.create({
		data: {
			...product,
			quantity: Number(product.quantity),
			userId,
		},
	});
}

async function getProductsByUserId(userId: number) {
	return await prisma.product.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: 'desc',
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

async function updateProductPhoto(productId: number, photo: string) {
	await prisma.product.update({
		where: { id: productId },
		data: { photo },
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
	updateProductPhoto,
};
