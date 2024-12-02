import { AppConfig } from './app.config';
import { dbConfig } from './db.config';
import { jwtConfig } from './jwt.config';

export * from './app.config';
export * from './db.config';
export * from './jwt.config';

export type IConfiguration = AppConfig &
  ReturnType<typeof dbConfig> &
  ReturnType<typeof jwtConfig>;
