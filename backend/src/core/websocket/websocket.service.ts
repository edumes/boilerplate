import { redis } from '@config/redis.config';
import { logger } from '@core/utils/logger';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface WebSocketClient {
  id: string;
  userId?: number;
  ws: WebSocket;
  subscriptions: Set<string>;
}

class WebSocketService {
  private clients: Map<string, WebSocketClient> = new Map();

  constructor() {
    if (redis) {
      this.setupRedisSubscription();
    }
  }

  private setupRedisSubscription() {
    const subscriber = redis!.duplicate();

    subscriber.subscribe('broadcast', err => {
      if (err) {
        logger.error('Redis subscription error:', err);
        return;
      }
    });

    subscriber.on('message', (channel, message) => {
      if (channel === 'broadcast') {
        this.broadcast(message);
      }
    });
  }

  public handleConnection(connection: WebSocket, request: FastifyRequest) {
    const clientId = crypto.randomUUID();

    const client: WebSocketClient = {
      id: clientId,
      userId: request.user?.id,
      ws: connection,
      subscriptions: new Set()
    };

    this.clients.set(clientId, client);

    logger.info(`Client connected: ${clientId}`);

    connection.on('message', (message: string) => {
      this.handleMessage(client, message);
    });

    connection.on('close', () => {
      this.handleDisconnect(clientId);
    });

    connection.on('error', error => {
      logger.error(`WebSocket error for client ${clientId}:`, error);
    });

    this.sendToClient(client, {
      type: 'connection',
      data: { clientId }
    });
  }

  private handleMessage(client: WebSocketClient, rawMessage: string) {
    try {
      const message = JSON.parse(rawMessage.toString());

      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(client, message.channels);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(client, message.channels);
          break;
        case 'ping':
          this.sendToClient(client, { type: 'pong' });
          break;
        default:
          logger.warn(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      logger.error('Error handling WebSocket message:', error);
    }
  }

  private handleSubscribe(client: WebSocketClient, channels: string[]) {
    channels.forEach(channel => {
      client.subscriptions.add(channel);
    });

    this.sendToClient(client, {
      type: 'subscribed',
      data: { channels }
    });
  }

  private handleUnsubscribe(client: WebSocketClient, channels: string[]) {
    channels.forEach(channel => {
      client.subscriptions.delete(channel);
    });

    this.sendToClient(client, {
      type: 'unsubscribed',
      data: { channels }
    });
  }

  private handleDisconnect(clientId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscriptions.clear();
      this.clients.delete(clientId);
      logger.info(`Client disconnected: ${clientId}`);
    }
  }

  public sendToClient(client: WebSocketClient, data: any) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  public broadcast(data: any, channel?: string) {
    const message = JSON.stringify(data);

    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        if (!channel || client.subscriptions.has(channel)) {
          client.ws.send(message);
        }
      }
    });
  }

  public sendToUser(userId: number, data: any) {
    this.clients.forEach(client => {
      if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(client, data);
      }
    });
  }

  public getActiveConnections(): number {
    return this.clients.size;
  }
}

export const wsService = new WebSocketService();
