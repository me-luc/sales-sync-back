import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { salesService } from 'services';
import { AuthenticatedRequest } from 'types';

export async function sellManually(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const { products } = req.body;
		const userId = req.userId;

		await salesService.createManualSale(Number(userId), products);
		res.sendStatus(httpStatus.CREATED);
	} catch (error) {
		next(error);
	}
}
