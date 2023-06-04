import Joi from 'joi';

const productSchema = Joi.object({
	name: Joi.string().required(),
	price: Joi.number().required(),
	description: Joi.string().optional(),
	quantity: Joi.number().required(),
	supplierId: Joi.number().optional(),
	photo: Joi.string().uri().optional(),
});

export const productCreateSchema = Joi.object({
	product: productSchema,
});

export const productUpdateSchema = Joi.object({
	id: Joi.number().required(),
	name: Joi.string().optional(),
	price: Joi.number().optional(),
	description: Joi.string().optional(),
	quantity: Joi.number().optional(),
	supplierId: Joi.number().optional(),
	photo: Joi.string().uri().optional(),
});

export const productDeleteSchema = Joi.object({
	productId: Joi.number().required(),
});
