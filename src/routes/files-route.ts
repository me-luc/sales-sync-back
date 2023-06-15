import { uploadProductPhoto } from 'aws/upload-s3';
import { Request, Router } from 'express';
import { uploadMiddleware } from 'middlewares/upload-middleware';

const filesRouter = Router();

filesRouter.post('/', uploadMiddleware, async (req, res) => {
	try {
		const newFileNameKey = 'newFileNameKey.jpg';
		const file = req.file;

		if (!file) {
			res.status(400).json({ error: 'No file provided' });
			return;
		}

		await uploadProductPhoto(file, newFileNameKey);

		res.status(200).json({ message: 'File uploaded successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to upload file' });
	}
});

export { filesRouter };
