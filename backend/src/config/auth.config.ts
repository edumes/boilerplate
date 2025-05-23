import { env } from '@config/env.config';

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  },
  passwordSaltRounds: 10
};
