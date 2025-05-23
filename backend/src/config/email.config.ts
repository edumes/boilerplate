import { env } from '@config/env.config';
import { logger } from '@core/utils/logger';
import nodemailer from 'nodemailer';

export const emailConfig = {
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === 'true',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD
    }
  },
  defaults: {
    from: {
      name: env.MAIL_FROM_NAME,
      address: env.MAIL_FROM_ADDRESS
    }
  },
  templateDir: '../templates/email'
};

export const transporter = nodemailer.createTransport(emailConfig.smtp);

transporter
  .verify()
  .then(() => logger.info('SMTP connection established'))
  .catch(err => logger.error('SMTP connection error:', err));
