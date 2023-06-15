import * as aws from 'aws/upload-s3';
import { productsService } from './products-service';
import { v4 as uuid } from 'uuid';

async function uploadProductPhoto(
	file: Express.Multer.File,
	productId: number
) {
	const newFileNameKey = `${uuid()}-${file.originalname}`;
	await aws.uploadProductPhoto(file, newFileNameKey);
	await productsService.updateProductPhoto(productId, newFileNameKey);
}

export const filesService = { uploadProductPhoto };
