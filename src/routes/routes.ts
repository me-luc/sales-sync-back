import { Response, Router, Request } from 'express';
import errorHandlingMiddleware from '../middlewares/error-handling-middleware';
import {
	authenticationRouter,
	productsRouter,
	filesRouter,
	salesRouter,
	webhooksRouter,
} from './index';

const routes = Router();
routes
	.use('/health', sendHealthStatus)
	.use('/auth', authenticationRouter)
	.use('/products', productsRouter)
	.use('/files', filesRouter)
	.use('/sales', salesRouter)
	.use('/webhooks', webhooksRouter);

routes.use(errorHandlingMiddleware);
routes.use(handleNotFoundRoute);

export { routes };

function handleNotFoundRoute(_req: Request, res: Response) {
	return res.send('Route does not exist!');
}
function sendHealthStatus(_req: Request, res: Response) {
	return res.send('OK');
}
