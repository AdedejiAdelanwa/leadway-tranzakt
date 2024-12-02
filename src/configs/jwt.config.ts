import { PropertyValueType } from 'src/utils';

export const jwtConfig = () => {
  return {
    jwt: {
      authTokenSecret: process.env.JWT_AUTH_TOKEN_SECRET,
      authTokenExpiryInMinutes:
        parseInt(process.env.AUTH_TOKEN_EXPIRY_IN_MINUTES, 10) || 1440,
    },
  };
};

export type JWTConfig = PropertyValueType<ReturnType<typeof jwtConfig>, 'jwt'>;
