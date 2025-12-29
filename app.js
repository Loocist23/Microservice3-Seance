import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import roomRouter from './src/routes/room.routes.js';
import showRouter from './src/routes/show.routes.js';
import { notFoundHandler, errorHandler } from './src/middleware/errorHandler.js';
import './src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/room', roomRouter);
app.use('/api/show', showRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'MicroService Séances de cinéma',
    endpoints: {
      room: '/api/room',
      show: '/api/show',
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
