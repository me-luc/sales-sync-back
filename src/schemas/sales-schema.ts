import Joi from 'joi';

export const SaleBodySchema = Joi.object({
	products: Joi.array().items(
		Joi.object({
			id: Joi.number().required(),
			quantity: Joi.number().required(),
		})
	),
});
