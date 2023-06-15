import { Upload } from '@aws-sdk/lib-storage';

import { s3 } from '../config/aws-s3';

export async function uploadProductPhoto(
	file: Express.Multer.File,
	newFileNameKey: string
) {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: newFileNameKey,
		Body: file.buffer,
	};

	return await new Upload({
		client: s3,
		params,
	}).done();
}
