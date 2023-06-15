import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import { BadRequestError } from '../errors/';

export function validateSchema(schema: Schema) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			if (Object.keys(req.body).length === 0) {
				throw BadRequestError('Missing request body');
			}

			const { error } = schema.validate(req.body, { abortEarly: false });

			if (error) {
				throw BadRequestError(error.message);
			}

			next();
		} catch (err) {
			next(err);
		}
	};
}
