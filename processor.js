import { Queue, Worker } from "bullmq";
import getFollowersId from "./follow.js";
import requestEmail from "./requestEmail.js";
import getContent from "./content.js";
// getFollowersId("4f5df828-f1b7-48ee-8ea0-811c7b975ef8");
const myWorker = new Worker(
  "image-process-production",
  async (job) => {
    if (job.name == "image-processor-production") {
      console.log(`Processing job ${job.id} with data: ${job.data.jobData}`);
      await getContent();
    }
  },
  {
    connection: {
      host: "144.126.141.132",
      port: 6379,
    },
  }
);
