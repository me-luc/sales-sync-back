import { NextFunction, Response } from 'express';
import { productsService, filesService } from '../services/';
import { AuthenticatedRequest } from '../types';
import httpStatus from 'http-status';

export async function createProduct(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const product = req.body;
		const file = req.file;
		const userId = req.userId;

		const newProduct = await productsService.createProduct(
			Number(userId),
			product
		);

		if (file) {
			console.log('file >>>', file);
			await filesService.uploadProductPhoto(file, Number(newProduct.id));
		}

		res.sendStatus(httpStatus.CREATED);
	} catch (error) {
		next(error);
	}
}

export async function deleteProduct(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const productId = req.params.id;
		const userId = req.userId;

		await productsService.deleteProduct(Number(productId), Number(userId));
		res.sendStatus(httpStatus.NO_CONTENT);
	} catch (error) {
		next(error);
	}
}

export async function updateProduct(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const product = req.body;
		const userId = req.userId;

		await productsService.updateProduct(Number(userId), product);
		res.sendStatus(httpStatus.NO_CONTENT);
	} catch (error) {
		next(error);
	}
}

export async function getProductsByUser(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const userId = req.userId;
		const products = await productsService.getProductsByUser(
			Number(userId)
		);
		res.status(httpStatus.OK).send(products);
	} catch (error) {
		next(error);
	}
}
