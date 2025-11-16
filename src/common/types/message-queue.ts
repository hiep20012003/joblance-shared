import {Channel} from "amqplib";
import {ExchangeType} from '../constants/constants';

export interface PublishOptions {
  channelName: string;
  exchange: string;
  routingKey?: string;
  message: string | Buffer;
  headers?: Record<string, any>;
}

export interface ConsumeOptions<T = any> {
  channelName: string;
  queue: string;
  exchange: string;
  maxRetries?: number;
  handler: (data: T) => Promise<void>;
  handlerRetryError?: (operation: string, context: unknown) => void;
}

export interface SetupRetryQueueOptions {
  channel: Channel;
  exchange: string;
  exchangeType: ExchangeType;
  routingKey: string;
  queue: string;
  headers?: Record<string, any>;
  retryTtl?: number;
}
