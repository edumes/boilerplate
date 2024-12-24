import { authMiddleware } from '@core/middlewares/auth.middleware';
import { FastifyInstance } from 'fastify';
import { wsService } from './websocket.service';

export default async function websocketRoutes(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true, preHandler: authMiddleware }, (connection, request) => {
    wsService.handleConnection(connection.socket, request);
  });
}
