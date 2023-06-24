import { Router } from 'express';
import {
	checkToken,
	getUserInfo,
	signIn,
	signUp,
	updateStripeAccount,
} from '../controllers';
import { validateSchema } from '../middlewares/schema-validation';
import { signInSchema, signUpSchema } from '../schemas/authentication-schemas';
import { authenticateToken } from 'middlewares';

const authenticationRouter = Router();
authenticationRouter
	.post('/sign-in', validateSchema(signInSchema), signIn)
	.post('/sign-up', validateSchema(signUpSchema), signUp)
	.get('/check-token', checkToken)
	.all('/*', authenticateToken)
	.get('/user-info', getUserInfo)
	.get('/update-stripe-account-link', updateStripeAccount);

export { authenticationRouter };
