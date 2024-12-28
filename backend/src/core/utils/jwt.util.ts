import { env } from '@config/env.config';
import jwt from 'jsonwebtoken';

export const verifyToken = async (token: string): Promise<any> => {
  return jwt.verify(token, env.JWT_SECRET);
};

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });
};
