// const ip = require("ip");

import { Kafka, logLevel } from "kafkajs";

const host = "144.126.141.132";
const CLIENT_ID = "streamke-video-events";

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`${host}:32768`],
  clientId: CLIENT_ID,
});

const topic = "video-events";
export const consumer = kafka.consumer({ groupId: "test-group" });

const run = async (body) => {
  const { id, status } = body;
  try {
    // Ensure connection is only established if not already connected
    await consumer.connect();

    // Subscribe to the topic before running the consumer
    await consumer.subscribe({ topic, fromBeginning: false });

    // Start the consumer, but don't attempt to subscribe again
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value.toString(); // Convert Buffer to string
        const parsedValue = JSON.parse(messageValue); // Parse the string as JSON

        // Filter for message with the given id and status
        if (id == parsedValue?.data?.video_id && status == 3) {
          // Post the message to an API or perform other actions
          // await postToDirectus(parsedValue); // Assume postToDirectus is your posting function
          // Optionally disconnect the consumer if needed (though not ideal in high-traffic cases)
          // await consumer.disconnect();
        }
      },
    });
  } catch (error) {
    console.error(`[run] ${error.message}`, error);
  }
};

// run().catch((e) => console.error(`[example/consumer] ${e.message}`, e));

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

export default run;
