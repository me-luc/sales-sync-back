import { sellManually } from 'controllers';
import { Router } from 'express';
import { authenticateToken, validateSchema } from 'middlewares';
import { ManualSaleBodySchema } from 'schemas/sales-schema';

const salesRouter = Router();

salesRouter
	.all('/*', authenticateToken)
	.post('/manual', validateSchema(ManualSaleBodySchema), sellManually)
	.post('/');

export { salesRouter };
