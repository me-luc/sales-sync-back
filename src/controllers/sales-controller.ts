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

export async function sellProduct(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const { products } = req.body;
		const userId = req.userId;

		const url = await salesService.createStripeSale(
			Number(userId),
			products
		);

		return res.status(httpStatus.CREATED).send({ url });
	} catch (error) {
		next(error);
	}
}

export async function handlePaymentSucceed(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		console.log('Payment succeeded');

		res.sendStatus(httpStatus.OK);
	} catch (error) {
		next(error);
	}
}

export async function handlePaymentFailed(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		console.log('Payment failed');

		res.sendStatus(httpStatus.OK);
	} catch (error) {
		next(error);
	}
}

export async function handlePaymentIntent(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { paymentIntent } = req.body.data.object;

		console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);

		res.sendStatus(httpStatus.OK);
	} catch (error) {
		next(error);
	}
}
