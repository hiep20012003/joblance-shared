import pino from 'pino';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { CustomError } from './error-handler';

// Logger class for structured logging using pino
export class Logger {
  private logger: pino.Logger;
  private logDir: string;

  /**
   * Initializes a new Logger instance for a given service.
   * @param serviceName - The name of the service using this logger.
   */
  constructor(private serviceName: string) {
    const isProd = process.env.ENVIRONMENT === 'production';
    this.logDir = isProd ? this.initLogDirectory() : '';
    const logFilePath = path.join(this.logDir, `${serviceName}.log`);

    // Configure pino transport based on environment
    const transport = isProd
      ? pino.transport({
          targets: [
            {
              target: 'pino/file',
              options: { destination: logFilePath, mkdir: true },
              level: 'info',
            },
          ],
        })
      : pino.transport({
          targets: [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
              },
              level: 'debug',
            },
          ],
        });

    // Create the pino logger instance
    this.logger = pino(
      {
        level: process.env.LOG_LEVEL || 'info',
        base: {
          service: serviceName,
          env: process.env.ENVIRONMENT || 'development',
          hostname: os.hostname(),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      transport
    );
  }

  /**
   * Initializes the log directory if it does not exist.
   * @returns The absolute path to the log directory.
   */
  private initLogDirectory(): string {
    const dir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Logs an info level message.
   * @param message - The log message.
   * @param extra - Additional metadata to log.
   */
  info(message: string, extra?: Record<string, any>) {
    this.logger.info({ msg: message, ...extra });
  }

  /**
   * Logs a warning level message.
   * @param message - The log message.
   * @param extra - Additional metadata to log.
   */
  warn(message: string, extra?: Record<string, any>) {
    this.logger.warn({ msg: message, ...extra });
  }

  /**
   * Logs an error with stack trace and optional context.
   * @param err - The error object.
   * @param context - Additional context information.
   */
  error(err: CustomError, context?: Record<string, any>) {
      const serializedError = err.serialize();

      // Extract message override if present in context
      const { msg, ...restContext } = context || {};

      this.logger.error(
        {
          ...restContext,
          error: serializedError,
          msg: msg || serializedError.message,
        }
      );
    }

  /**
   * Logs an HTTP request with relevant details.
   * @param params - HTTP request details.
   */
  httpRequest({
    method,
    path,
    statusCode,
    durationMs,
    requestId,
    userId,
  }: {
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
    requestId?: string;
    userId?: string;
  }) {
    this.logger.info({
      msg: 'HTTP Request',
      http: {
        method,
        path,
        status_code: statusCode,
        duration_ms: durationMs,
      },
      request_id: requestId,
      user: userId ? { id: userId } : undefined,
    });
  }
}

