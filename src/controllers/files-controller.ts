import { NextFunction, Request, Response } from 'express';

async function uploadImage(req: Request, res: Response, next: NextFunction) {
	try {
	} catch (error) {
		next(error);
	}
}

export { uploadImage };
