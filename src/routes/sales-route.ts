import {
	getUserSales,
	handlePaymentFailed,
	handlePaymentIntent,
	handlePaymentSucceed,
	sellManually,
	sellProduct,
	updateStripeAccount,
} from 'controllers';
import { Router } from 'express';
import { authenticateToken, validateSchema } from 'middlewares';
import { ManualSaleBodySchema } from 'schemas/sales-schema';

const salesRouter = Router();

salesRouter
	.post('/stripe/success', handlePaymentSucceed)
	.post('/stripe/cancel', handlePaymentFailed)
	.post('/stripe/intent', handlePaymentIntent)
	.all('/*', authenticateToken)
	.get('/', getUserSales)
	.post('/manual', validateSchema(ManualSaleBodySchema), sellManually)
	.post('/', sellProduct)
	.get('/user-stripe-account', updateStripeAccount)
	.post('/payment-link');

export { salesRouter };
