import { emailConfig, transporter } from '@config/email.config';
import { logger } from '@core/utils/logger';
import Queue from 'bull';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { join } from 'path';

const emailQueue = new Queue('email-queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
  }
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

class EmailService {
  private async loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate> {
    const templatePath = join(__dirname, emailConfig.templateDir, `${templateName}.hbs`);
    const templateContent = await readFile(templatePath, 'utf-8');
    return Handlebars.compile(templateContent);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const { to, subject, template, context, attachments } = options;

      let html: string | undefined;
      if (template) {
        const templateFn = await this.loadTemplate(template);
        html = templateFn(context || {});
      }

      await emailQueue.add({
        to,
        subject,
        html,
        attachments,
        ...emailConfig.defaults
      });

      logger.info('Email queued successfully', { to, subject });
    } catch (error) {
      logger.error('Error queueing email', { error, options });
      throw error;
    }
  }
}

emailQueue.process(async job => {
  try {
    await transporter.sendMail(job.data);
    logger.info('Email sent successfully', {
      to: job.data.to,
      subject: job.data.subject
    });
  } catch (error) {
    logger.error('Error sending email', { error, data: job.data });
    throw error;
  }
});

export const emailService = new EmailService();
