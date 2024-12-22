import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '3333'),
  NODE_ENV: process.env.NODE_ENV || 'development',

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_DATABASE: process.env.DB_DATABASE || 'database',

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'password',
  REDIS_TTL: parseInt(process.env.REDIS_TTL || '3600'),

  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',

  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '3600'),

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_SECURE: process.env.SMTP_SECURE || 'false',
  SMTP_USER: process.env.SMTP_USER || 'your-email@gmail.com',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'your-app-specific-password',
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || 'Your App Name',
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS || 'noreply@yourapp.com',
};
