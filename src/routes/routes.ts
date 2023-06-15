import { Response, Router, Request } from 'express';
import errorHandlingMiddleware from '../middlewares/error-handling-middleware';
import { authenticationRouter } from './authentication-route';
import { productsRouter } from './products-route';
import { filesRouter } from './files-route';

const routes = Router();
routes
	.use('/health', sendHealthStatus)
	.use('/auth', authenticationRouter)
	.use('/products', productsRouter)
	.use('/files', filesRouter);

routes.use(errorHandlingMiddleware);
routes.use(handleNotFoundRoute);

export { routes };

function handleNotFoundRoute(req: Request, res: Response) {
	return res.send('Route does not exist!');
}
function sendHealthStatus(req: Request, res: Response) {
	return res.send('OK');
}
