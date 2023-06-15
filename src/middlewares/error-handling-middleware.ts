import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationError } from '../types';

export default function errorHandlingMiddleware(
	err: ApplicationError | Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	const { name, message } = err;

	if (name === 'UnauthorizedError') {
		return res.status(httpStatus.UNAUTHORIZED).send({ message });
	}

	if (name === 'ForbiddenError') {
		return res.status(httpStatus.FORBIDDEN).send({ message });
	}

	if (name === 'BadRequestError') {
		return res.status(httpStatus.BAD_REQUEST).send({ message });
	}

	if (name === 'InvalidCredentialsError') {
		return res.status(httpStatus.UNAUTHORIZED).send({ message });
	}

	if (err instanceof SyntaxError) {
		return res
			.status(httpStatus.BAD_REQUEST)
			.send({ message: 'Syntax error!' });
	}

	console.log(err);

	return res
		.status(httpStatus.INTERNAL_SERVER_ERROR)
		.send({ message: 'Internal server error' });
}
