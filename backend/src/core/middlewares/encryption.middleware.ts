import { env } from '@config/env.config';
import { EncryptionService } from '@core/utils/encryption.util';
import { FastifyReply, FastifyRequest } from 'fastify';

const encryptionService = new EncryptionService(env.ENCRYPTION_KEY);

export async function encryptionMiddleware(request: FastifyRequest, reply: FastifyReply) {
  if (!env.ENCRYPTION_ENABLED) return;

  if (request.body && (request.body as any).encrypted) {
    const { encryptedData, iv, authTag } = request.body as any;
    try {
      const decryptedData = encryptionService.decrypt(encryptedData, iv, authTag);
      request.body = JSON.parse(decryptedData);
    } catch (error) {
      reply.code(400).send({ error: 'Invalid encrypted data' });
      return;
    }
  }

  const originalSend = reply.send;
  reply.send = function (payload: any) {
    if (payload && typeof payload === 'object') {
      const stringifiedData = JSON.stringify(payload);
      const encryptedResponse = encryptionService.encrypt(stringifiedData);
      return originalSend.call(this, {
        encrypted: true,
        ...encryptedResponse,
      });
    }
    return originalSend.call(this, payload);
  };
}
