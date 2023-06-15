import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: { fileSize: 1024 * 1024 * 5 },
});

export function uploadMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	upload.single('file')(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				res.status(413).json({ error: 'File Too Large' });
			} else {
				res.status(422).json({ error: err.message });
			}
		} else if (err) {
			res.status(500).json({ error: 'Failed to process file upload' });
		} else {
			next();
		}
	});
}

export function uploadOptionalMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	upload.single('file')(req, res, (err) => {
		next();
	});
}
