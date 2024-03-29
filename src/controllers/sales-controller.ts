import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { salesService } from 'services';
import { stripeService } from 'services/stripe-service';
import { userService } from 'services/user-service';
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

export async function getUserSales(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const userId = req.userId;

		const sales = await salesService.getUserSales(Number(userId));
		res.status(httpStatus.OK).send(sales);
	} catch (error) {
		next(error);
	}
}

export async function getPaymentLink(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const { products } = req.body;
		const userId = req.userId;

		const url = await salesService.getPaymentLink(Number(userId), products);

		return res.status(httpStatus.CREATED).send({ url });
	} catch (error) {
		next(error);
	}
}

export async function updateStripeAccount(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const userId = req.userId;

		const user = await userService.getUserById(Number(userId));

		const account = await stripeService.createNewAccount(
			Number(userId),
			user.email,
			user.name
		);

		const url = await stripeService.getUpdateAccountLink(account.id);

		res.status(httpStatus.OK).send({ url });
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
		const paymentIntent = req.body;

		await salesService.updateSaleStatus(paymentIntent.id, 'PAID');

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
		console.log('🚫 Payment failed', req.body);
		const paymentIntent = req.body;

		const payment = await salesService.getPaymentByStripeId(
			paymentIntent.id
		);

		await salesService.updateSaleStatus(paymentIntent.id, 'CANCELLED');

		await salesService.refundStock(payment.saleId);

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
		console.log('💰 Payment intent', req.body);

		res.sendStatus(httpStatus.OK);
	} catch (error) {
		next(error);
	}
}

export async function handleAccountUpdated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { disabled_reason } = req.body;
		const active = disabled_reason ? false : true;

		await userService.updateUserStripeAccountStatus(req.body.id, active);
		res.sendStatus(httpStatus.OK);
	} catch (error) {
		next(error);
	}
}
