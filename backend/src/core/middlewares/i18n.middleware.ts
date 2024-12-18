import { logger } from '@core/utils/logger';
import { FastifyReply, FastifyRequest } from 'fastify';
import i18next, { TFunction } from 'i18next';

declare module 'fastify' {
  interface FastifyRequest {
    lang?: string;
    t?: TFunction;
  }
}

export async function i18nMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const lang = request.headers['accept-language']?.split(',')[0] || request.query['lang'] || 'en';

  try {
    await i18next.changeLanguage(lang);
    request.lang = lang;

    // logger.debug(`Language set to: ${lang}`);
  } catch (error) {
    logger.error('Error setting language', { error, lang });
  }
}
