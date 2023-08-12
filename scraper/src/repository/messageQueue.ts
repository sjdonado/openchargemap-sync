import amqp from 'amqplib';

import env from '../config/env';

export type ConsumerHandler = (
  msg: amqp.ConsumeMessage,
  channel: amqp.Channel,
) => void;

type MessageQueueConnection = Promise<
  [
    (queue: string, consumerHandler: ConsumerHandler) => void,
    () => Promise<void>,
  ]
>;

export const connectMessageQueue: () => MessageQueueConnection = async () => {
  const connection = await amqp.connect(env.RABBITMQ_URI);

  const channel = await connection.createChannel();

  await channel.assertExchange(env.RABBITMQ_DLX, 'direct', {
    durable: false,
  });

  await channel.assertQueue(env.RABBITMQ_DLQ, { durable: false });

  await channel.bindQueue(env.RABBITMQ_DLQ, env.RABBITMQ_DLX, '');

  await channel.assertQueue(env.RABBITMQ_QUEUE, {
    durable: false,
    arguments: {
      'x-dead-letter-exchange': env.RABBITMQ_DLX,
    },
  });

  const startConsumer = (queue: string, consumerHandler: ConsumerHandler) => {
    // eslint-disable-next-line
    channel.consume(queue, (msg: amqp.ConsumeMessage | null) => {
      if (msg !== null) {
        consumerHandler(msg, channel);
      }
    });

    console.log(`[messageQueue]: Consumer connected to ${env.RABBITMQ_QUEUE}`);
  };

  const disconnect = async () => {
    await channel.close();
    await connection.close();
  };

  return [startConsumer, disconnect];
};
