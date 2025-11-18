import winston, {format, createLogger} from 'winston';
import 'winston-daily-rotate-file';
import {ecsFormat} from '@elastic/ecs-winston-format';

export interface LogMetadata {
  [key: string]: unknown;
}

export interface LogParams {
  operation?: string;
  context?: unknown;
  metadata?: unknown;
  error?: unknown;
  req?: any;
  res?: any;
}

type LogVariant = 'short' | 'full';

export class Logger {
  private readonly logger: ReturnType<typeof createLogger>;
  private readonly serviceName: string;
  private readonly isDev: boolean;
  private readonly logEnabled: boolean;
  private readonly logVariant: LogVariant;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.isDev = (process.env.ENVIROMENT || 'development') === 'development';
    this.logEnabled = process.env.LOG_ENABLED !== 'false'; // bật/tắt log console
    this.logVariant = (process.env.LOG_VARIANT as LogVariant) || 'full'; // 'short' hoặc 'full'

    this.logger = createLogger({
      level: 'info',
      format: ecsFormat({
        serviceName: this.serviceName,
        serviceEnvironment: process.env.ENVIROMENT || 'development',
        apmIntegration: true,
        convertErr: true,
        convertReqRes: true
      }),
      transports: [
        // Console transport
        new winston.transports.Console({
          silent: !this.logEnabled,
          format: this.consoleFormat()
        }),

        // File: info
        new winston.transports.DailyRotateFile({
          dirname: 'logs/info',
          filename: `application-${this.serviceName}-%DATE%.info.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '100m',
          maxFiles: '14d',
          level: 'info',
          format: ecsFormat({
            serviceName: this.serviceName,
            serviceEnvironment: process.env.ENVIROMENT || 'development',
            apmIntegration: true,
            convertErr: true,
            convertReqRes: true
          })
        }),

        // File: error
        new winston.transports.DailyRotateFile({
          dirname: 'logs/error',
          filename: `application-${this.serviceName}-%DATE%.error.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '200m',
          maxFiles: '30d',
          level: 'error',
          format: ecsFormat({
            serviceName: this.serviceName,
            serviceEnvironment: process.env.ENVIROMENT || 'development',
            apmIntegration: true,
            convertErr: true,
            convertReqRes: true
          })
        })
      ]
    });
  }

  private consoleFormat() {
    // Nếu logVariant = 'short' → chỉ in message + timestamp ngắn gọn
    if (this.logVariant === 'short') {
      return format.combine(
        format.timestamp({format: 'HH:mm:ss'}),
        format.printf(({level, message, timestamp}) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
      );
    }

    // full → pretty print đầy đủ
    return this.isDev
      ? format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
        format.errors({stack: true}),
        format.splat(),
        format.prettyPrint()
      )
      : ecsFormat({
        serviceName: this.serviceName,
        serviceEnvironment: process.env.ENVIROMENT || 'development',
        apmIntegration: true,
        convertErr: true,
        convertReqRes: true
      });
  }

  private commonParams(params: LogParams) {
    const {context, metadata, error, operation, req, res} = params;

    const payload: Record<string, unknown> = {operation};

    if (context) payload.context = context;
    if (metadata) payload.metadata = metadata;
    if (error) payload.error = error;
    if (req && typeof req === 'object') payload.req = this.sanitizeRequest(req);
    if (res && typeof res === 'object') payload.res = this.sanitizeResponse(res);

    return payload;
  }

  private sanitizeRequest(req: any) {
    return {
      method: req.method,
      url: req.url,
      ip: req.ip ?? req.connection?.remoteAddress
    };
  }

  private sanitizeResponse(res: any) {
    return {
      message: res.message,
      statusCode: res.statusCode
    };
  }

  info(message: string, params: LogParams = {}) {
    if (!this.logger.isLevelEnabled('info')) return;
    this.logger.info({message, ...this.commonParams(params)});
  }

  warn(message: string, params: LogParams = {}) {
    if (!this.logger.isLevelEnabled('warn')) return;
    this.logger.warn({message, ...this.commonParams(params)});
  }

  error(message: string, params: LogParams = {}) {
    if (!this.logger.isLevelEnabled('error')) return;
    this.logger.error({message, ...this.commonParams(params)});
  }
}
