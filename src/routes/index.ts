import { Response, Router, Request } from 'express';
import healthRoutes from './health-route';
import authenticationRoutes from './authentication-route';
import errorHandlingMiddleware from '../middlewares/error-handling-middleware';
import { authenticateToken } from '../middlewares/authentication-middleware';

const routes = Router();
routes.use('/health', sendHealthStatus).use('/auth', authenticationRoutes);
routes.use(errorHandlingMiddleware);
routes.use(handleNotFoundRoute);

export default routes;

function handleNotFoundRoute(req: Request, res: Response) {
	return res.send('Route does not exist!');
}
function sendHealthStatus(req: Request, res: Response) {
	return res.send('OK');
}
