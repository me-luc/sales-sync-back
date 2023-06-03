import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import BadRequestError from '../errors/bad-request-error';

export function validateSchema(schema: Schema) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
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
