import Redis from 'ioredis';
import { Logger } from '../logging';
import { ServerError } from '..';

import type { Redis as RedisType } from 'ioredis';

export interface CacheClient {
  get(key: string): Promise<string | null>;
  setEx(key: string, ttl: number, value: string): Promise<void>;
  getMap(key: string): Promise<Map<string, string>>;
  setMap(key: string, ttl: number, map: Map<string, string>): Promise<void>;
  exists(key: string): Promise<boolean>;
  del(key: string): Promise<void>;
}

export class RedisClient implements CacheClient {
  protected client: RedisType;

  constructor(host: string, protected logger: Logger) {
    this.client = new Redis(host);
  }

  public connect(): void {
    const operation = 'redis:connect';

    this.client.on('connect', () => {
      this.logger.info('Redis client connected to Redis', { operation });
    });

    this.client.on('error', (error: unknown) => {
      throw new ServerError({
        logMessage: 'Failed to establish Redis connection',
        cause: error,
        operation: 'redis:connect-error',
      });
    });
  }

  public getClient(): RedisType {
    return this.client;
  }

  public async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      throw new ServerError({
        logMessage: `Redis GET failed for key: ${key}`,
        cause: error,
        operation: 'redis:get',
      });
    }
  }

  public async set(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value);
    } catch (error) {
      throw new ServerError({
        logMessage: `Redis SET failed for key: ${key}`,
        cause: error,
        operation: 'redis:set',
      });
    }
  }

  public async setEx(key: string, ttl: number, value: string): Promise<void> {
    try {
      await this.client.setex(key, ttl, value);
    } catch (error) {
      throw new ServerError({
        logMessage: `Redis SETEX failed for key: ${key}`,
        cause: error,
        operation: 'redis:setEx',
      });
    }
  }

  public async getMap(key: string): Promise<Map<string, string>> {
    try {
      const obj = await this.client.hgetall(key);
      return new Map<string, string>(Object.entries(obj));
    } catch (error) {
      throw new ServerError({
        logMessage: `Redis HGETALL failed for key: ${key}`,
        cause: error,
        operation: 'redis:getMap',
      });
    }
  }

  public async setMap(key: string, ttl: number, map: Map<string, string>): Promise<void> {
    try {
      await this.client.hset(key, map);
      await this.client.expire(key, ttl);
    } catch (error) {
      throw new ServerError({
        logMessage: `Redis HSET failed for key: ${key}`,
        cause: error,
        operation: 'redis:setMap',
      });
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      throw new ServerError({
        logMessage: `Redis EXISTS failed for key: ${key}`,
        cause: error,
        operation: 'redis:exists',
      });
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      throw new ServerError({
        logMessage: `Redis DEL failed for key: ${key}`,
        cause: error,
        operation: 'redis:del',
      });
    }
  }
}
