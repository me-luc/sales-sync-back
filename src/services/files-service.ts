import * as aws from 'aws/upload-s3';
import { productsService } from './products-service';
import { v4 as uuid } from 'uuid';
import { productsRepository } from 'repositories';
import { NotFoundError } from 'errors';

async function uploadProductPhoto(
	file: Express.Multer.File,
	productId: number
) {
	const newFileNameKey = `${uuid()}-${file.originalname}`;
	await aws.uploadProductPhoto(file, newFileNameKey);
	await productsService.updateProductPhoto(productId, newFileNameKey);
}

async function deleteProductPhoto(photo: string, productId: number) {
	if (!photo) throw NotFoundError('Product not found');

	await aws.deleteProductPhoto(photo);
	await productsRepository.updateProductPhoto(productId, null);
}

export const filesService = { uploadProductPhoto, deleteProductPhoto };
