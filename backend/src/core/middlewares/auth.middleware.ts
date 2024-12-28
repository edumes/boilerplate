import { env } from '@config/env.config';
import { EncryptionService } from '@core/utils/encryption.util';
import { verifyToken } from '@core/utils/jwt.util';
import { FastifyReply, FastifyRequest } from 'fastify';

const encryptionService = new EncryptionService(env.ENCRYPTION_KEY);

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (env.ENCRYPTION_ENABLED && request.body && (request.body as any).encrypted) {
      const { encryptedData, iv, authTag } = request.body as any;
      try {
        const decryptedData = encryptionService.decrypt(encryptedData, iv, authTag);
        request.body = JSON.parse(decryptedData);
      } catch (error) {
        reply.code(400).send({ error: 'Invalid encrypted data' });
        return;
      }
    }

    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      reply.code(401).send({ error: 'No token provided' });
      return;
    }

    const decoded = await verifyToken(token);
    request.user = decoded;

    if (env.ENCRYPTION_ENABLED) {
      const originalSend = reply.send;
      reply.send = function (payload: any) {
        if (payload && typeof payload === 'object') {
          const stringifiedData = JSON.stringify(payload);
          const encryptedResponse = encryptionService.encrypt(stringifiedData);
          return originalSend.call(this, {
            ...encryptedResponse,
          });
        }
        return originalSend.call(this, payload);
      };
    }
  } catch (error) {
    reply.code(401).send({ error: 'Invalid token' });
  }
}
