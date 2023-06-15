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
import { uploadOptionalMiddleware } from 'middlewares/';

const productsRouter = Router();

productsRouter
	.all('*', authenticateToken)
	.get('/', getProductsByUser)
	.post(
		'/',
		uploadOptionalMiddleware,
		validateSchema(productCreateSchema),
		createProduct
	)
	.put('/', validateSchema(productUpdateSchema), updateProduct)
	.delete('/:id', deleteProduct);

export { productsRouter };
