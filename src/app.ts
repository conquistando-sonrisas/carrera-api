/// <reference path="../index.d.ts" />

import 'reflect-metadata'
import 'dotenv/config'

import express from 'express'
import limiter from './config/limiter';
import morgan from 'morgan';
import cors from 'cors'
import helmet from 'helmet';
import carreraRouter from './routes/carreraRouter';
import orm from './config/db';
import { requestContextHelper } from './middlewares/ormHelper';
import logger from './config/logger';
import jwtCheck from './config/auth';
import adminRouter from './routes/adminRouter';


export async function bootstrap(port: number) {
  await tryToConnectToDb();

  const app = express();
  app.set('trust proxy', 1)
  /**Middlewares app level */
  app.use(limiter);
  app.use(morgan('combined'));
  app.use(cors());
  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // add request context orm
  app.use(requestContextHelper)

  /** Route definition */
  app.use('/api/v1/carrera', carreraRouter);

  app.use('/api/v1/admin', jwtCheck, adminRouter)

  const server = app.listen(port, () => {
    logger.info(`App started listening on port ${port}`);
  });

  return server;
}


async function tryToConnectToDb() {
  try {
    if (!process.env.DB_NAME) return;

    await orm.connect();
  } catch (err) {
    logger.error('Connection to database failed', err)
  }
} 