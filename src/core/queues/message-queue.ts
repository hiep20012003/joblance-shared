import {ServerError} from "../errors";
import amqp, {Channel, ConsumeMessage, ChannelModel} from "amqplib";
import {ConsumeOptions, PublishOptions, SetupRetryQueueOptions, ExchangeType} from "../../common";
import {v4 as uuidv4} from "uuid";

export class MessageQueue {
  private static instance: MessageQueue;
  private connection!: ChannelModel;
  private channels: Map<string, Channel> = new Map();

  private constructor(private url: string) {
  }

  public static getInstance(url: string): MessageQueue {
    if (!MessageQueue.instance) {
      MessageQueue.instance = new MessageQueue(url);
    }
    return MessageQueue.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.connection) {
        this.connection = await amqp.connect(`${this.url}`);
      }
    } catch (error) {
      throw new ServerError({
        logMessage: 'Failed to establish RabbitMQ connection',
        cause: error,
        operation: 'queue:connect-error'
      });
    }
  }

  public async close(): Promise<void> {
    try {
      for (const [name, channel] of this.channels) {
        await channel.close();
      }
      await this.connection.close();
    } catch (error) {
      throw new ServerError({
        logMessage: "Failed to close RabbitMQ resources",
        cause: error,
        operation: "queue:close-error",
      });
    }
  }

  public async setupRetryQueue(options: SetupRetryQueueOptions) {
    const {
      channel,
      queue,
      routingKey,
      exchange,
      exchangeType,
      headers = {},
      retryTtl = 10000,
    } = options;

    const baseQueue = `${queue}.queue`;
    const retryQueue = `${queue}.retry.queue`;
    const deadQueue = `${queue}.dead.queue`;

    const retryExchange = `${exchange}.${queue}.retry`;
    const deadExchange = `${exchange}.${queue}.dead`;

    await channel.assertExchange(exchange, exchangeType, {durable: true});
    await channel.assertExchange(retryExchange, "direct", {durable: true});
    await channel.assertExchange(deadExchange, "direct", {durable: true});

    await channel.assertQueue(baseQueue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": retryExchange,
        "x-dead-letter-routing-key": "retry",
      },
    });

    await channel.assertQueue(retryQueue, {
      durable: true,
      arguments: {
        "x-message-ttl": retryTtl,
        "x-dead-letter-exchange": exchange,
        "x-dead-letter-routing-key": routingKey,
      },
    });

    await channel.assertQueue(deadQueue, {durable: true});

    switch (exchangeType) {
      case ExchangeType.Fanout:
        await channel.bindQueue(baseQueue, exchange, "");
        break;
      case ExchangeType.Headers:
        await channel.bindQueue(baseQueue, exchange, "", {...headers});
        break;
      case ExchangeType.Topic:
      case ExchangeType.Direct:
      default:
        await channel.bindQueue(baseQueue, exchange, routingKey);
        break;
    }

    await channel.bindQueue(retryQueue, retryExchange, "retry");
    await channel.bindQueue(deadQueue, deadExchange, "dead");
  }

  public async createChannel(name: string): Promise<Channel> {
    try {
      if (!this.connection) {
        throw new ServerError({
          logMessage: `Connection not established. Call connect() first.`,
          operation: "queue:create-channel-error",
        });
      }

      if (this.channels.has(name)) {
        return this.channels.get(name)!;
      }

      const channel = await this.connection.createChannel();
      await channel.prefetch(1);
      this.channels.set(name, channel);
      return channel;
    } catch (error) {
      throw new ServerError({
        logMessage: `Failed to create channel: ${name}`,
        cause: error,
        operation: "queue:create-channel-error",
      });
    }
  }

  public async publish(options: PublishOptions) {
    const {channelName, exchange, routingKey = "", message, headers} = options;
    try {
      const channel = await this.createChannel(channelName);

      channel.publish(exchange, routingKey, Buffer.from(message), {headers, messageId: uuidv4()});
    } catch (error) {
      throw new ServerError({
        logMessage: `Failed to publish message to exchange "${exchange}" with routingKey "${routingKey}"`,
        cause: error,
        operation: "queue:publish-error",
      });
    }
  }

  public async consume<T = any>(options: ConsumeOptions<T>) {
    const {
      channelName,
      queue,
      exchange,
      handler,
      maxRetries = 3,
      handlerRetryError,
    } = options;

    const queueName = `${queue}.queue`;

    try {
      const channel = await this.createChannel(channelName);

      channel.consume(queueName, async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        const content = msg.content.toString();
        const headers = msg.properties.headers ?? {};
        const deaths = headers["x-death"] as { count: number }[] | undefined;
        const retryCount = deaths?.[0]?.count ?? 0;

        const messageId = msg.properties.messageId ?? "unknown";

        try {
          const data = JSON.parse(content);
          await handler({...data, messageId});

          channel.ack(msg);
        } catch (error) {
          const errors = (error as Error).message;

          if (retryCount >= maxRetries) {
            // Gửi sang deadExchange
            channel.publish(
              `${exchange}.${queue}.dead`,
              "dead",
              Buffer.from(content),
              {headers}
            );
            channel.ack(msg);

            handlerRetryError?.("consume-retry-limit", {
              queue: queueName,
              messageId,
              maxRetries,
              errors,
            });
          } else {
            console.debug('Retrying...');
            channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      throw new ServerError({
        logMessage: `Failed to start consumer`,
        cause: error,
        operation: "consumer-setup-failed",
        context: {queue: queueName},
      });
    }
  }


}
