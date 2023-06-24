import { NextFunction, Request, Response } from 'express';
import authenticationService from '../services/authentication-service';
import httpStatus from 'http-status';
import { userService } from 'services/user-service';
import { AuthenticatedRequest } from 'types';

export async function signIn(req: Request, res: Response, next: NextFunction) {
	try {
		const { email, password } = req.body;

		const token = await authenticationService.signIn(email, password);
		res.status(httpStatus.OK).send({ token });
	} catch (err) {
		next(err);
	}
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
	try {
		const { email, password, name } = req.body;
		const token = await authenticationService.signUp(email, password, name);
		res.status(httpStatus.CREATED).send({ token });
	} catch (err) {
		next(err);
	}
}

export async function checkToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token)
			return res.status(httpStatus.UNAUTHORIZED).send({
				message: 'Invalid token!',
			});

		await authenticationService.checkToken(token);
		return res.sendStatus(httpStatus.OK);
	} catch (err) {
		next(err);
	}
}

export async function getUserInfo(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const userId = req.userId;

		const userInfo = await userService.getUserById(Number(userId));

		return res.status(httpStatus.OK).send({
			name: userInfo.name,
			stripeCompletedProfile: userInfo.stripeCompletedProfile,
			stripeAccountId: userInfo.stripeAccountId,
		});
	} catch (err) {
		next(err);
	}
}
