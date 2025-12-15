import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import sequelize from './public/connexion/database.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import {Show, Room } from './public/model/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

await sequelize.authenticate();
console.log('✅ MySQL connecté');

await sequelize.sync({ alter: true });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server up on ${PORT}`));

export default app;
