import {
	handlePaymentFailed,
	handlePaymentIntent,
	handlePaymentSucceed,
	sellManually,
	sellProduct,
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
	.post('/manual', validateSchema(ManualSaleBodySchema), sellManually)
	.post('/', sellProduct);

export { salesRouter };
