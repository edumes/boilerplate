import { env } from '@config/env.config';

export const appConfig = {
  app: {
    name: 'Backend API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    port: env.PORT,
  },

  locale: {
    timezone: 'America/Sao_Paulo',
    defaultLanguage: 'pt-BR',
    supportedLanguages: ['pt-BR', 'en-US'],
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    currencyFormat: {
      locale: 'pt-BR',
      currency: 'BRL',
    },
  },

  features: {
    redis: {
      enabled: true,
    },
  },
};
