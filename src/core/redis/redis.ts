import Redis from 'ioredis';


import { Logger } from '../logging';
import { ServerError } from '..';

import type { Redis as RedisType } from 'ioredis';

export interface CacheClient {
  get(key: string): Promise<string | null>;
  setEx(key: string, ttl: number, value: string): Promise<void>;
  getMap(key: string): Promise<Map<string, string>>;
  setMap(key: string, ttl: number, map: Map<string, string>): Promise<void>;
}

export class RedisClient implements CacheClient {
  protected client: RedisType;

  constructor(host: string, private logger: Logger) {
    this.client = new Redis(host);
  }

  public connect(): void {
    const operation = 'redis:connect';
    this.client.on('connect', () => {
      this.logger.info('Auth Redis client connected to Redis', { operation });

    });

    this.client.on('error', (error: unknown) => {
      throw new ServerError({
        logMessage: 'Failed to establish Redis connection',
        cause: error,
        operation: 'redis:connect-error'
      });
    });
  }

  public getClient(): RedisType {
    return this.client;
  }

  public async get(key: string) {
    return await this.client.get(key);
  }

  public async setEx(key: string, ttl: number, value: string): Promise<void> {
    await this.client.setex(key, ttl, JSON.stringify(value));
  }

  public async getMap(key: string): Promise<Map<string, string>> {
    const obj = await this.client.hgetall(key);
    return new Map<string, string>(Object.entries(obj));
  }

  public async setMap(key: string, ttl: number, map: Map<string, string>): Promise<void> {
    await this.client.hset(key, map);
    await this.client.expire(key, ttl);
  }
}

