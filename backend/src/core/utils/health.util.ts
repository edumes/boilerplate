import { AppDataSource } from '@config/database.config';
import { formatUptime } from '@core/utils/date.util';
import os from 'os';

const formatMemory = (memory: number): string => `${Math.round(memory / 1024 / 1024)}MB`;

const getMemoryUsage = () => {
  const memoryUsage = process.memoryUsage();
  return {
    ...memoryUsage,
    formatted: {
      heapUsed: formatMemory(memoryUsage.heapUsed),
      rss: formatMemory(memoryUsage.rss),
      heapTotal: formatMemory(memoryUsage.heapTotal),
      external: formatMemory(memoryUsage.external),
    },
  };
};

const getSystemInfo = () => ({
  platform: process.platform,
  arch: process.arch,
  cpus: os.cpus().length,
  loadAvg: os.loadavg(),
  totalMemory: formatMemory(os.totalmem()),
  freeMemory: formatMemory(os.freemem()),
});

const getSystemStatus = () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
  uptime: {
    seconds: process.uptime(),
    formatted: formatUptime(new Date(process.uptime() * 1000)),
  },
  memory: getMemoryUsage(),
  system: getSystemInfo(),
});

export default getSystemStatus;
