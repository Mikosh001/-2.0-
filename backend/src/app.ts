import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ message: 'Профессия 2.0 API' });
});

app.use('/openapi.json', (_req, res) => {
  res.sendFile(path.join(__dirname, '../openapi.json'));
});

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Ресурс табылмады' });
});

app.use(errorHandler);

export default app;
