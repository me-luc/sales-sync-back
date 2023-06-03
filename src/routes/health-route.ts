import { Request, Response, Router } from 'express';

const healthRoute = Router();

healthRoute.get('/', (request: Request, response: Response) => {
	return response.send({ message: 'Hello World!' });
});

export default healthRoute;
