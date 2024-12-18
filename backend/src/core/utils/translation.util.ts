import { redis } from '@config/redis.config';
import { Translate } from '@google-cloud/translate/build/src/v2';

export class TranslationService {
  private translator: Translate;

  constructor() {
    this.translator = new Translate();
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    const cacheKey = `translation:${text}:${targetLang}`;

    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const [translation] = await this.translator.translate(text, targetLang);

    await redis.set(cacheKey, translation, 'EX', 86400); // 24h cache

    return translation;
  }
}
