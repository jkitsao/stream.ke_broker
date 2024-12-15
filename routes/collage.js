import { Hono } from "hono";
import axios from "axios";
import scheduleJob from "../scheduler.js";
const collage = new Hono();
// const testid = "319f3ecd-822f-474b-a83a-ed9c937ecfdf";
collage.get("/", (c) => c.text("List Video stats")); // GET /videos
collage.get("/trigger", async (c) => {
  // GET /videos/:id
  //   const id = c.req.param("id");
  //   const data = await fetchData(id);
  // console.log(data);
  await scheduleJob();
  //   return c.json(data);
  return c.text("List Video stats");
});

export default collage;
