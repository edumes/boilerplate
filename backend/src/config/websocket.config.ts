import { logger } from '@core/utils/logger';
import websocket from '@fastify/websocket';
import { FastifyInstance } from 'fastify';

export async function setupWebSocket(server: FastifyInstance) {
  await server.register(websocket, {
    options: {
      clientTracking: true,
      maxPayload: 1048576,
      pingInterval: 25000,
      pongTimeout: 10000
    }
  });

  logger.info('WebSocket server initialized');
}
