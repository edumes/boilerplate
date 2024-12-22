import { env } from '@config/env.config';
import nodemailer from 'nodemailer';

export const emailConfig = {
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE === 'true',
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  },
  defaults: {
    from: {
      name: env.MAIL_FROM_NAME,
      address: env.MAIL_FROM_ADDRESS,
    },
  },
  templateDir: '../templates/email',
};

export const transporter = nodemailer.createTransport(emailConfig.smtp);

transporter
  .verify()
  .then(() => console.log('SMTP connection established'))
  .catch(err => console.error('SMTP connection error:', err));
