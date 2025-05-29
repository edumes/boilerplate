import { env } from '@config/env.config';
import { EncryptionService } from '@core/utils/encryption.util';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Encryption service instance for handling encrypted requests/responses
 */
const encryptionService = new EncryptionService(env.ENCRYPTION_KEY);

/**
 * Middleware that handles encryption/decryption of request and response data
 * - Decrypts encrypted request bodies
 * - Encrypts response data
 * Only active when encryption is enabled in environment config
 * 
 * @param {FastifyRequest} request - The Fastify request object
 * @param {FastifyReply} reply - The Fastify reply object
 * @returns {Promise<void>}
 */
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
        ...encryptedResponse
      });
    }
    return originalSend.call(this, payload);
  };
}
