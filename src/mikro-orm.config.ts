import 'dotenv/config'

import { defineConfig } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Participante } from "./entities/Participante.entity";
import { Boleto } from "./entities/Boleto.entity";
import { Registro } from './entities/Registro.entity';
import logger from './config/logger';


const config = defineConfig({
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME,
  entities: [Participante, Boleto, Registro],
  debug: process.env.NODE_ENV !== 'production',
  forceUtcTimezone: true,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT),
  name: process.env.DB_NAME,
  extensions: [Migrator],
  colors: false,
  logger: (message) => logger.info(message)
})

export default config;