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


  /** Route definition */
  app.use('/api/v1/carrera', carreraRouter);

  const server = app.listen(port, () => {
    process.stdout.write(`App started listening on port ${port}`);
  });

  return server;
}


async function tryToConnectToDb() {
  try {
    if (!process.env.DB_NAME) return;
    
    await orm.connect();
  } catch (err) {
    console.log('Connection to database failed', err)
  }
} 