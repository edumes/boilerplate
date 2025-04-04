import { env } from '@config/env.config';

interface CurrencyFormat {
  locale: string;
  currency: string;
}

interface LocaleConfig {
  timezone: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  dateFormat: string;
  timeFormat: string;
  dateTimeFormat: string;
  currencyFormat: CurrencyFormat;
}

interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: string;
    port: number;
  };
  locale: LocaleConfig;
  features: {
    redis: {
      enabled: boolean;
    };
  };
}

export const appConfig: AppConfig = {
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
      enabled: false,
    },
  },
};
