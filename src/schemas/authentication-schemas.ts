import Joi from 'joi';

export const signInSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const signUpSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	name: Joi.string().required(),
});
