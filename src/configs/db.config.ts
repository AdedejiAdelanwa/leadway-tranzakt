import { PropertyValueType } from 'src/utils';

export const dbConfig = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    db: {
      host: process.env.DB_HOST,
      name: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT!, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: process.env.DB_DIALECT as 'postgres',
      ssl: ['development', 'test'].includes(nodeEnv)
        ? false
        : {
            rejectUnauthorized: false,
          },
    },
  };
};

export type DBConfig = PropertyValueType<ReturnType<typeof dbConfig>, 'db'>;
