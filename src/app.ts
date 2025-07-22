/// <reference path="../index.d.ts" />

import 'reflect-metadata'
import 'dotenv/config'

import express from 'express'
import limiter from './config/limiter';
import logger from './config/logger';
import morgan from 'morgan';
import cors from 'cors'
import helmet from 'helmet';


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


  const server = app.listen(port, () => {
    process.stdout.write(`App started listening on port ${port}`);
  });

  return server;
}


