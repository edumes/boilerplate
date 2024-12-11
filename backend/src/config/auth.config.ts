import { env } from '@config/env.config';

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET || 'secret',
    expiresIn: '1d',
  },
  passwordSaltRounds: 10,
};
