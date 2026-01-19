import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import sequelize from './src/config/database.js';
import {Show, Room } from './src/models/index.js';

import roomRouter from './src/routes/room.routes.js';
import showRouter from './src/routes/show.routes.js';

import { errorHandler } from './src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/room', roomRouter);
app.use('/api/show', showRouter);
app.get('/', (req, res) => {
    res.json({
        message: 'MicroService Séances de cinéma', 
        endpoints: {
            room: '/api/room',
            show: '/api/show'
        }
    });
});
app.use(errorHandler);


await sequelize.authenticate();
console.log('✅ MySQL connecté');

await sequelize.sync({ alter: true });

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`🚀 Server up on ${PORT}`));

export default app;
