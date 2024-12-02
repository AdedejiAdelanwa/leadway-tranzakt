import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dbConfig } from './configs';
import * as dotenv from 'dotenv';

dotenv.config();
const config = dbConfig().db;

const appDatasource = new DataSource({
  host: config.host,
  port: config.port,
  type: config.dialect,
  database: config.name,
  username: config.user,
  password: config.password,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  useUTC: true,
  ssl: config.ssl,
});

export default appDatasource;
