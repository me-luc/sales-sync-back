import { getUserSales, sellManually, sellProduct } from 'controllers';
import { Router } from 'express';
import { authenticateToken, validateSchema } from 'middlewares';
import { ManualSaleBodySchema } from 'schemas/sales-schema';

const salesRouter = Router();

salesRouter

	.all('/*', authenticateToken)
	.get('/', getUserSales)
	.post('/manual', validateSchema(ManualSaleBodySchema), sellManually)
	.post('/', sellProduct)
	.post('/payment-link');

export { salesRouter };
