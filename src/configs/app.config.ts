export const appConfig = () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3001,
    environment: process.env.NODE_ENV,
    bcryptSaltRound: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  };
};

export type AppConfig = ReturnType<typeof appConfig>;
