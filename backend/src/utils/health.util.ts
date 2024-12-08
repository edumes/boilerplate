import { AppDataSource } from '@config/database';
import os from 'os';
import formatUptime from './date.util';

const getSystemStatus = () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
  uptime: {
    seconds: process.uptime(),
    formatted: formatUptime(process.uptime()),
  },
  memory: {
    ...process.memoryUsage(),
    formatted: {
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(process.memoryUsage().external / 1024 / 1024)}MB`,
    },
  },
  system: {
    platform: process.platform,
    arch: process.arch,
    cpus: os.cpus().length,
    loadAvg: os.loadavg(),
    totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
    freeMemory: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
  },
});

export default getSystemStatus;
