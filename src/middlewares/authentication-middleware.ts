import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../errors/unauthorized-error';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTPayload } from '../types/application-types';

export async function authenticateToken(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token === null || token === undefined) {
		throw UnauthorizedError('Missing token');
	}

	try {
		const { userId } = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET as string
		) as JWTPayload;

		req.userId = userId;
		return next();
	} catch (error) {
		throw UnauthorizedError('Invalid token');
	}
}
