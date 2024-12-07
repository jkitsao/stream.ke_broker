import { Queue, Worker } from "bullmq";

// Create a new connection in every instance
const myQueue = new Queue("notify", {
  connection: {
    host: "144.126.141.132",
    port: 6379,
  },
});

// function to add job
async function addJob(content) {
  try {
    let res = await myQueue.add("cars", {
      content: content,
      //   delay: 30000,
    });
    console.log("Job added");
    return res;
  } catch (error) {
    console.log("Job not added");
    return error;
  }
}

// let cont = {
//   title: "Test video title",
//   video_id: "testid55554",
//   creator: "4f5df828-f1b7-48ee-8ea0-811c7b975ef8",
// };

// await addJob(cont);

export default addJob;
