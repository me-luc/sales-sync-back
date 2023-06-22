import {
	getPaymentLink,
	getUserSales,
	sellManually,
	sellProduct,
} from 'controllers';
import { Router } from 'express';
import { authenticateToken, validateSchema } from 'middlewares';
import { SaleBodySchema } from 'schemas/sales-schema';

const salesRouter = Router();

salesRouter
	.all('/*', authenticateToken)
	.get('/', getUserSales)
	.post('/manual', validateSchema(SaleBodySchema), sellManually)
	.post('/', sellProduct)
	.post('/payment-link', validateSchema(SaleBodySchema), getPaymentLink);

export { salesRouter };
