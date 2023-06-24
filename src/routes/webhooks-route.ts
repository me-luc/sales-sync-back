import { Router } from 'express';
import {
	handleAccountUpdated,
	handlePaymentFailed,
	handlePaymentIntent,
	handlePaymentSucceed,
} from 'controllers';

const webhooksRouter = Router();

webhooksRouter
	.post('/payment-success', handlePaymentSucceed)
	.post('/payment-cancel', handlePaymentFailed)
	.post('/payment-intent', handlePaymentIntent)
	.post('/account-updated', handleAccountUpdated);

export { webhooksRouter };
