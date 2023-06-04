import { Router } from 'express';

import { authenticateToken, validateSchema } from '../middlewares';
import {
	createProduct,
	deleteProduct,
	getProductsByUser,
	updateProduct,
} from 'controllers';
import {
	productCreateSchema,
	productDeleteSchema,
	productUpdateSchema,
} from 'schemas/products-schema';

const productsRouter = Router();

productsRouter
	.all('*', authenticateToken)
	.get('/', getProductsByUser)
	.post('/', validateSchema(productCreateSchema), createProduct)
	.put('/', validateSchema(productUpdateSchema), updateProduct)
	.delete('/', validateSchema(productDeleteSchema), deleteProduct);

export { productsRouter };
