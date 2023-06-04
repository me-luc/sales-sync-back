import { Router } from 'express';
import { signIn, signUp } from '../controllers';
import { validateSchema } from '../middlewares/schema-validation';
import { signInSchema, signUpSchema } from '../schemas/authentication-schemas';

const authenticationRouter = Router();
authenticationRouter.post('/sign-in', validateSchema(signInSchema), signIn);
authenticationRouter.post('/sign-up', validateSchema(signUpSchema), signUp);

export { authenticationRouter };
