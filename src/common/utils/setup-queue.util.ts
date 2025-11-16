import { BINDINGS } from '../types';
import { MessageQueue } from '../../core';


type SetupErrorHandler = (error: Error, queueName?: string) => void;

export async function setupAllQueues(
  mq: MessageQueue,
  errorHandler: SetupErrorHandler
) {
  const setupChannelName = "setup-channel";

  try {
    const channel = await mq.createChannel(setupChannelName);

    await Promise.all(
      BINDINGS.map(async (b) => {
        try {
          await mq.setupRetryQueue({
            channel,
            queue: b.queue,
            exchange: b.exchange,
            exchangeType: b.exchangeType,
            routingKey: b.routingKey,
          });
          console.log(`[Setup] Queue ${b.queue} setup successfully.`);
        } catch (err) {
          console.error(`[Setup] Failed to setup queue ${b.queue}:`, err);
          errorHandler(err as Error, b.queue);
        }
      })
    );
  } catch (err) {
    console.error(`[Setup] Failed to create setup channel:`, err);
    errorHandler(err as Error);
  }
}
