import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(
	cors({
		origin: [process.env.CLIENT_URL, process.env.LOCAL_SERVER_URL],
	})
);
app.use(express.json());
app.use('/api/', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
