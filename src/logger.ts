import pino from 'pino';
import path from 'path';
import fs from 'fs';
// Ensure the logs directory exists

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function createLogger(serviceName: string) {
  const logFilePath = path.join(logDir, `${serviceName}.log`);

  return pino({
    base: { service: serviceName }, 
    level: process.env.LOG_LEVEL || 'info',
  }, pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: { destination: logFilePath, mkdir: true },
        level: 'info'
      },
      {
        target: 'pino-pretty',
        options: { colorize: true },
        level: 'debug'
      }
    ]
  }));
}

export {createLogger};
