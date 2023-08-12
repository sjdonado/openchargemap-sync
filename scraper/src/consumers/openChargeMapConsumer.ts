import { type ConsumerHandler } from '../repository/messageQueue';

export const openChargeMapConsumer: ConsumerHandler = async (msg, channel) => {
  console.log(`new message: ${msg.content.toString()}`);
  channel.ack(msg);
};
