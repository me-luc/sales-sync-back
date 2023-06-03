import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationError } from '../types';

export default function errorHandlingMiddleware(
	err: ApplicationError | Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err.name === 'UnauthorizedError') {
		return res.status(httpStatus.UNAUTHORIZED).send(err.message);
	}

	if (err.name === 'ForbiddenError') {
		return res.status(httpStatus.FORBIDDEN).send(err.message);
	}

	if (err.name === 'BadRequestError') {
		return res.status(httpStatus.BAD_REQUEST).send(err.message);
	}

	return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
}
