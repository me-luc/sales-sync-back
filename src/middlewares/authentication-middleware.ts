import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { sessionsRepository } from '../repositories';
import { UnauthorizedError } from '../errors';
import { AuthenticatedRequest, JWTPayload } from 'types';

export async function authenticateToken(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token === null || token === undefined) {
		return res.sendStatus(401);
	}

	try {
		const { userId } = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET as string
		) as JWTPayload;

		const existingSession = await sessionsRepository.getSessionByToken(
			token
		);
		if (!existingSession) throw UnauthorizedError('Invalid token');

		req.userId = userId;
		return next();
	} catch (error) {
		return res.sendStatus(401);
	}
}
