import { AppDataSource } from '@config/database.config';
import { formatUptime } from '@core/utils/date.util';
import os from 'os';

/**
 * Formats memory size in bytes to megabytes
 * @param memory - Memory size in bytes
 * @returns Formatted memory size string
 */
const formatMemory = (memory: number): string => `${Math.round(memory / 1024 / 1024)}MB`;

/**
 * Gets current memory usage statistics
 * @returns Object containing memory usage details with formatted values
 */
const getMemoryUsage = () => {
  const memoryUsage = process.memoryUsage();
  return {
    ...memoryUsage,
    formatted: {
      heapUsed: formatMemory(memoryUsage.heapUsed),
      rss: formatMemory(memoryUsage.rss),
      heapTotal: formatMemory(memoryUsage.heapTotal),
      external: formatMemory(memoryUsage.external)
    }
  };
};

/**
 * Gets system information
 * @returns Object containing system details
 */
const getSystemInfo = () => ({
  platform: process.platform,
  arch: process.arch,
  cpus: os.cpus().length,
  loadAvg: os.loadavg(),
  totalMemory: formatMemory(os.totalmem()),
  freeMemory: formatMemory(os.freemem())
});

/**
 * Gets complete system status including database connection, memory usage and system info
 * @returns Object containing system status details
 */
const getSystemStatus = () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
  uptime: {
    seconds: process.uptime(),
    formatted: formatUptime(new Date(process.uptime() * 1000))
  },
  memory: getMemoryUsage(),
  system: getSystemInfo()
});

export default getSystemStatus;
