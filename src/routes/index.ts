import { Router } from 'express';
import healthRoute from './health-route';
import authenticationRoute from './authentication-route';

const routes = Router();
routes.use('/health', healthRoute);
routes.use('/authentication', authenticationRoute);

export default routes;
