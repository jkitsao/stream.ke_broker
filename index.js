import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { setValue, getValue } from "./redis.js";
import postToDirectus from "./directus.js";
import addJob from "./add.js";
import videos from "./routes/stats.js";
import { logger } from "hono/logger";
// import producer from "./producer.js";
// import run from "./consumer.js";
const app = new Hono();
app.use("*", logger());
app.use("/content/*", cors());
app.use("/videos/*", cors());
app.route("/videos", videos);
app.get("/", (c) => c.text("Hello Node.js!"));
// get post body from stream.ke
app.post("/content/entry", async (c) => {
  const body = await c.req.json();
  const { description, title, tier, creator_id, status, price, creator } = body;
  const { guid, videoLibraryId } = body.data;
  const event = {
    type: "VideoPublished",
    data: {
      description,
      title,
      pricing: tier,
      creator_id,
      creator,
      status,
      price: 5,
      video_id: guid,
      library_id: videoLibraryId,
      required_key: "356f6c8e-cc61-4df0-b25b-1b2c41b6bc3e", //default list
    },
    timestamp: Date.now(),
  };
  // Just use redis as a temporary state manager
  let res = await setValue(guid, event);
  console.log(res);
  return c.json({ message: "Hello!" });
});
/**
 *  Consume video events process and
 *   send to directus
 */
function parseJSONWithCleanup(jsonString) {
  // Remove trailing commas before closing braces or brackets
  const cleanedString = jsonString.replace(/,(\s*[\}\]])/g, "$1");
  return JSON.parse(cleanedString);
}
app.post("/content/trigger", async (c) => {
  const body = await c.req.json();
  const parsedObject = parseJSONWithCleanup(body);
  let { id, status } = parsedObject;
  if (status == 3) {
    try {
      let value = await getValue(id);
      let parsedValues = JSON.parse(value).data;
      let res = await postToDirectus(parsedValues);
      console.log("JOB has started");
      // Destructure required info to send notification job
      // create job
      let { title, creator, video_id } = parsedValues;
      let content = { title, creator, video_id };
      try {
        await addJob(content);
        // console.log({ jobres });
        return c.json(res);
      } catch (error) {
        console.error("error posting Job", error);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    return c.json({ message: "OK" });
  }
  return c.json(parsedObject);
});
serve({
  fetch: app.fetch,
  port: 8787,
});
