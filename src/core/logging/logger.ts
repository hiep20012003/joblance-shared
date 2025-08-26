import util from 'util';

import { Request } from 'express';
import winston, { format, createLogger } from 'winston';

import 'winston-daily-rotate-file';
import { ApplicationError } from '../errors';

export interface LogMetadata {
  [key: string]: unknown;
}

export interface LogParams {
  operation: string;
  req?: Request;
  context?: unknown;
  metadata?: unknown;
  error?: unknown;
}

export class Logger {
  private readonly logger: ReturnType<typeof createLogger>;
  private readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;

    const consoleFormat = winston.format.printf((info) => {
      const colorizer = winston.format.colorize();
      const {
        level,
        message,
        timestamp,
        metadata,
        context,
        error,
        operation,
        traceId,
        clientId,
        url,
        method
      } = info as {
        level: string;
        message: string;
        timestamp: string;
        metadata?: Record<string, unknown>;
        context?: unknown;
        error?: unknown;
        operation?: string;
        traceId?: string;
        clientId?: string;
        url?: string;
        method?: string;
        [key: string]: unknown;
      };

      const coloredTimestampAndLevel = colorizer.colorize(level, `${timestamp} [${level.toUpperCase()}]:`);

      const objectsToLog = this.cleanObject({
        // operation,
        // traceId,
        // clientId,
        url,
        method,
        metadata,
        context,
        error
      });

      const syntaxHighlightedObjects =
    objectsToLog && Object.keys(objectsToLog).length > 0
      ? '\n' + util.inspect(objectsToLog, { colors: true, depth: null, compact: false })
      : '';

      return `${coloredTimestampAndLevel} ${message}${syntaxHighlightedObjects}`;
    });


    this.logger = createLogger({
      format: format.combine(
        format.timestamp({
          format: `YYYY-MM-DD hh:mm:ss.SSS`,
        }),
        format.json()
      ),
      defaultMeta: {
        service: this.serviceName,
        env: process.env.ENVIRONMENT || 'development'
      },
      transports: [
        new winston.transports.Console({
          format: consoleFormat
        }),
        new winston.transports.DailyRotateFile({
          dirname: 'logs/info',
          filename: `application-${this.serviceName}-%DATE%.info.log`,
          datePattern: 'YYYY-MM-DD-HH-mm',
          zippedArchive: true,
          maxSize: '1m',
          maxFiles: '14d',
          level: 'info',
        }),
        new winston.transports.DailyRotateFile({
          dirname: 'logs/error',
          filename: `application-${this.serviceName}-%DATE%.error.log`,
          datePattern: 'YYYY-MM-DD-HH-mm',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '1d',
          level: 'error',
        }),
      ],
    });
  }

  private cleanObject(obj?: unknown): Record<string, unknown> | undefined {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return undefined;
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .filter(([_, v]) =>
          v !== undefined &&
        v !== null &&
        !(typeof v === 'object' && v !== null && Object.keys(v).length === 0)
        )
    );
  }


  private cleanError(error?: unknown): unknown {
    if (!error) return undefined;

    if (error instanceof Error) {
      if ('serialize' in error && typeof (error as ApplicationError).serialize === 'function') {
        const serialized = (error as ApplicationError).serialize();
        return this.cleanObject(serialized);
      }

      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    if (typeof error === 'object') {
      return this.cleanObject(error as Record<string, unknown>);
    }

    return error;
  }


  private commonParams(params: LogParams) {
    const { context, req, metadata, error, operation } = params;

    const cleanedMetadata = this.cleanObject(metadata);
    const cleanedContext = this.cleanObject(context as Record<string, unknown>);
    const cleanedError = this.cleanError(error);

    const traceId = req?.traceContext?.traceId ?? 'unknown';
    const clientId = req?.headers['x-forwarded-for']?.toString().split(',')[0] || req?.ip || 'unknown';
    const url = req?.originalUrl;
    const method = req?.method;

    const payload: Record<string, unknown> = {
      operation,
      traceId,
      clientId,
      url,
      method,
    };

    // Build flat metadata correctly
    if (cleanedMetadata) {
      const flatMetadata: Record<string, unknown> = {};

      // If nested `metadata.metadata`, flatten it into `metadata`
      if ('metadata' in cleanedMetadata && typeof cleanedMetadata.metadata === 'object') {
        Object.assign(flatMetadata, cleanedMetadata.metadata as Record<string, unknown>);
      }

      // // Move `message` to `responseMessage` if exists
      // if ('message' in cleanedMetadata) {
      //   flatMetadata.responseMessage = cleanedMetadata.message;
      // }

      // Other top-level keys stay
      for (const [key, value] of Object.entries(cleanedMetadata)) {
        if (key !== 'metadata' && key !== 'message') {
          flatMetadata[key] = value;
        }
      }

      payload.metadata = flatMetadata;
    }

    if (cleanedContext) {
      payload.context = cleanedContext;
    }
    if (cleanedError) {
      payload.error = cleanedError;
    }

    return payload;
  }


  info(message: string, params: LogParams) {
    const logObject = Object.assign(
      { message }, this.commonParams(params)
    );
    this.logger.info(logObject);
  }

  error(message: string, params: LogParams) {
    const logObject = Object.assign(
      { message }, this.commonParams(params)
    );
    this.logger.error(logObject);
  }

  warn(message: string, params: LogParams) {
    const logObject = Object.assign(
      { message }, this.commonParams(params)
    );
    this.logger.warn(logObject);
  }
}
