import { Kafka, CompressionTypes, logLevel } from "kafkajs";
const HOST = "144.126.141.132";
const CLIENT_ID = "streamke-video-events";
const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${HOST}:32768`],
  clientId: CLIENT_ID,
});

// const topic = "topic-test";
const producer = kafka.producer();

export default producer;
