/// <reference path="../index.d.ts" />

import 'reflect-metadata'
import 'dotenv/config'

import express from 'express'
import limiter from './config/limiter';
import morgan from 'morgan';
import cors from 'cors'
import helmet from 'helmet';
import carreraRouter from './routes/carreraRouter';


export async function bootstrap(port: number) {
  const app = express();

  /**Middlewares app level */
  app.use(limiter);
  app.use(morgan('combined'));
  app.use(cors());
  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  /** Route definition */
  app.use('carrera', carreraRouter);

  const server = app.listen(port, () => {
    process.stdout.write(`App started listening on port ${port}`);
  });

  return server;
}


