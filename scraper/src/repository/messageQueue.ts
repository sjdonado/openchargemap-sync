import amqp from 'amqplib';

import env from '../config/env';

export type ConsumerHandler = (
  msg: amqp.ConsumeMessage,
  channel: amqp.Channel,
) => void;

export type PublishMessage = (
  exchangeName: string,
  message: string,
) => Promise<boolean>;

type MessageQueueConnection = Promise<
  [
    (queueName: string, consumerHandler: ConsumerHandler) => void,
    PublishMessage,
    () => Promise<void>,
  ]
>;

export const connectMessageQueue: () => MessageQueueConnection = async () => {
  const connection = await amqp.connect(env.RABBITMQ_URI);

  const channel = await connection.createChannel();

  await channel.assertQueue(env.RABBITMQ_DLQ, { durable: false });
  await channel.assertQueue(env.RABBITMQ_QUEUE, {
    durable: false,
    arguments: {
      'x-dead-letter-exchange': env.RABBITMQ_DLX,
    },
  });

  await channel.assertExchange(env.RABBITMQ_DLX, 'direct', { durable: false });
  await channel.assertExchange(env.RABBITMQ_EXCHANGE, 'direct', {
    durable: true,
  });

  await channel.bindQueue(env.RABBITMQ_DLQ, env.RABBITMQ_DLX, '');
  await channel.bindQueue(env.RABBITMQ_QUEUE, env.RABBITMQ_EXCHANGE, '');

  const startConsumer = (
    queueName: string,
    consumerHandler: ConsumerHandler,
  ) => {
    // eslint-disable-next-line
    channel.consume(queueName, (msg: amqp.ConsumeMessage | null) => {
      if (msg !== null) {
        consumerHandler(msg, channel);
      }
    });

    console.log(`[messageQueue]: Consumer connected to ${env.RABBITMQ_QUEUE}`);
  };

  const publishMessage: PublishMessage = async (exchangeName, message) =>
    channel.publish(exchangeName, '', Buffer.from(message), {
      persistent: true,
    });

  const disconnect = async () => {
    await channel.close();
    await connection.close();
  };

  return [startConsumer, publishMessage, disconnect];
};
