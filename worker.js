import { Queue, Worker } from "bullmq";
import getFollowersId from "./follow.js";
import requestEmail from "./requestEmail.js";
// getFollowersId("4f5df828-f1b7-48ee-8ea0-811c7b975ef8");
const myWorker = new Worker(
  "notify",
  async (job) => {
    if (job.name === "cars") {
      let { creator, title, video_id } = job.data.content;
      console.log(JSON.stringify(job.data));
      let res = await getFollowersId(creator);
      console.log({ res });
      res.map(async (follow) => {
        let emailData = {
          recepient: follow.user_email,
          creator: follow.creator_name,
          name: follow.user_name,
          video_name: title,
          video_id: video_id,
        };
        await requestEmail(emailData);
      });
    }
  },
  {
    connection: {
      host: "144.126.141.132",
      port: 6379,
    },
  }
);
