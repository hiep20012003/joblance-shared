import { ServerError } from "../errors";
import amqp, { Channel, ConsumeMessage, ChannelModel } from "amqplib";
import { MessageQueueType } from "./message-queue-type";

export enum ExchangeType {
  Direct = "direct",
  Topic = "topic",
  Fanout = "fanout",
  Headers = "headers"
}

interface ConsumerOptions<T = any> {
  channelName: string;
  exchange: string;
  queue: string;
  routingKey: string;
  handler: (data: T) => Promise<void>;
  handlerRetryError?: (operation: string, context: unknown) => void
  maxRetries?: number;
  exchangeType?: ExchangeType;
  headers?: Record<string, any>
}

export class MessageQueue  {
  private static instance: MessageQueue;
  private connection!: ChannelModel;
  private channels: Map<string, Channel> = new Map();

  private constructor(private url: string){
  }

  public static getInstance(url: string) : MessageQueue {
    if (!MessageQueue.instance) {
      MessageQueue.instance = new MessageQueue(url);
    }
    return MessageQueue.instance;
  }


 public async connect(): Promise<void>{
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

  private async setupRetryQueue(
    channel: Channel,
    baseQueueName: string,
    routingKey: string,
    mainExchange: string,
    exchangeType: ExchangeType,
    headerBindings: Record<string, any> = {}
  ) {
    const baseQueue = `${baseQueueName}.queue`;
    const retryQueue = `${baseQueueName}.retry.queue`;
    const deadQueue = `${baseQueueName}.dead.queue`;

    const retryRoutingKey = `${routingKey}.retry`;
    const deadRoutingKey = `${routingKey}.dead`;

    const retryExchange = `${mainExchange}.retry`;
    const deadExchange = `${mainExchange}.dead`;

    // Main exchange
    await channel.assertExchange(mainExchange, exchangeType, { durable: true });

    // Retry & Dead exchanges
    await channel.assertExchange(retryExchange, "direct", { durable: true });
    await channel.assertExchange(deadExchange, "direct", { durable: true });

    // Main queue
    await channel.assertQueue(baseQueue, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": retryExchange,
        "x-dead-letter-routing-key": retryRoutingKey,
      },
    });

    // Retry queue
    await channel.assertQueue(retryQueue, {
      durable: true,
      arguments: {
        "x-message-ttl": 10000,
        "x-dead-letter-exchange": mainExchange,
        "x-dead-letter-routing-key": routingKey,
      },
    });

    // Dead queue
    await channel.assertQueue(deadQueue, { durable: true });

    switch (exchangeType) {
      case "fanout":
        await channel.bindQueue(baseQueue, mainExchange, "");
        break;
      case "headers":
        await channel.bindQueue(baseQueue, mainExchange, "", {...headerBindings});
        break;
      case "topic":
      case "direct":
      default:
        await channel.bindQueue(baseQueue, mainExchange, routingKey);
        break;
    }

    // Retry & dead exchanges
    await channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);
    await channel.bindQueue(deadQueue, deadExchange, deadRoutingKey);
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

  public async publish(
    channelName: string,
    exchange: string,
    routingKey: string,
    message: string,
    exchangeType: ExchangeType,
    headers?: Record<string, any>
  ) {
    try {
      const channel = await this.createChannel(channelName);
      await channel.assertExchange(exchange, exchangeType, { durable: true });

      const options: any = { persistent: true };
      if (exchangeType === "headers" && headers) {
        options.headers = headers;
      }

      const rk = exchangeType === "fanout" ? "" : routingKey;

      channel.publish(exchange, rk, Buffer.from(message), options);
    } catch (error) {
      throw new ServerError({
        logMessage: `Failed to publish message to exchange "${exchange}" with routingKey "${routingKey}"`,
        cause: error,
        operation: "queue:publish-error",
      });
    }
  }

  public async consume<T = any>({
    channelName,
    exchange,
    queue,
    routingKey,
    handler,
    handlerRetryError,
    maxRetries = 3,
    exchangeType = ExchangeType.Direct,
    headers = {}
  }: ConsumerOptions<T>): Promise<void> {
    const queueName = `${queue}.queue`;

    try {
      const channel = await this.createChannel(channelName);

      // Setup queues + retry
      await this.setupRetryQueue(channel, queue, routingKey, exchange, exchangeType, headers);

      channel.consume(queueName, (msg: ConsumeMessage | null) => {
        void (async () => {
          if (!msg) return;

          let errors;
          try {
            const data = JSON.parse(msg.content.toString());
            await handler(data);
            channel.ack(msg);
          } catch (error) {
            errors = (error as Error).toString();
            const content = msg.content.toString();
            const msgHeaders = msg.properties.headers ?? {};
            const deaths = msgHeaders["x-death"] as { count: number }[] | undefined;
            const retryCount = deaths?.[0]?.count || 0;

            const messageId: string = (msg.properties.messageId as string) ?? "unknown-id";

            if (retryCount >= maxRetries) {
              channel.publish(
                `${exchange}.dead`,
                `${routingKey}.dead`,
                Buffer.from(content),
                { headers: msgHeaders }
              );
              channel.ack(msg);

              if (handlerRetryError)
                handlerRetryError("consume-retry-limit", {
                  queue: queueName,
                  routingKey,
                  messageId,
                  maxRetries,
                  errors,
                });
            } else {
              channel.nack(msg, false, false);
            }
          }
        })();
      });
    } catch (error) {
      throw new ServerError({
        logMessage: `Failed to start consumer`,
        cause: error,
        operation: "consumer-setup-failed",
        context: { queue: queueName },
      });
    }
  }

}
