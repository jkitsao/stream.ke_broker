import { delay, Queue, Worker } from "bullmq";

// Create a new connection in every instance
const myQueue = new Queue("image-process-production-001", {
  connection: {
    host: "144.126.141.132",
    port: 6379,
  },
});

// function to add job
async function scheduleJob() {
  try {
    let res = await myQueue.add("collage", {
      content: "Dynamic image data",
      //   delay: 30000,
    });
    console.log("Job added");
    return res;
  } catch (error) {
    console.log("Job not added");
    return error;
  }
  // try {
  //   let res = await myQueue.upsertJobScheduler(
  //     "processor-production",
  //     {
  //       every: 60000, // Job will repeat every 60000 milliseconds (50 seconds)
  //     },
  //     {
  //       name: "image-processor-production",
  //       data: { jobData: "data" },
  //       opts: {}, // Optional additional job options
  //     },
  //     {
  //       delay: 60000,
  //     }
  //   );
  //   await getJobs();
  // } catch (error) {
  //   console.log("Job not added");
  //   return error;
  // }
}
// scheduleJob();
export default scheduleJob;
getJobs();
// remove job

async function getJobs() {
  // Retrieve the first 10 job schedulers in ascending order of their next execution time
  const schedulers = await myQueue.getJobSchedulers(0, 9, true);
  console.log("Current job schedulers:", schedulers);
  //   const result = await myQueue.removeJobScheduler("processor-production");
  //   console.log(
  //     result ? "Scheduler removed successfully" : "Missing Job Scheduler"
  //   );
}

// let cont = {
//   title: "Test video title",
//   video_id: "testid55554",
//   creator: "4f5df828-f1b7-48ee-8ea0-811c7b975ef8",
// };

// await addJob(cont);

// export default addJob;
