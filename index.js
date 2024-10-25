import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { setValue, getValue } from "./redis.js";
import postToDirectus from "./directus.js";
// import producer from "./producer.js";
// import run from "./consumer.js";
const app = new Hono();
app.use("/content/*", cors());
app.get("/", (c) => c.text("Hello Node.js!"));
// get post body from stream.ke
app.post("/content/entry", async (c) => {
  const body = await c.req.json();
  const { description, title, tier, creator_id, status, price } = body;
  const { guid, videoLibraryId } = body.data;
  const event = {
    type: "VideoPublished",
    data: {
      description,
      title,
      pricing: tier,
      creator_id,
      status,
      price: 5,
      video_id: guid,
      library_id: videoLibraryId,
    },
    timestamp: Date.now(),
  };
  // Just use redis as a temporary state manager
  let res = await setValue(guid, event);
  console.log(res);
  return c.json({ message: "Hello!" });

  /**
   *   Convert and publish data as kafka formated event
   *
   */
  // async function sendMessage() {
  //   await producer.connect();
  //   await producer.send({
  //     topic: "video-events",
  //     messages: [{ value: JSON.stringify(event) }],
  //   });
  //   await producer.disconnect();
  // }

  // sendMessage().catch(console.error);
  // return c.json({ message: "Hello!" });
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
  // console.log(typeof parsedObject);
  let { id, status } = parsedObject;
  if (status == 3) {
    let value = await getValue(id);
    // console.log(typeof JSON.parse(value));
    let parsedValues = JSON.parse(value).data;
    // console.log({ parsedValues });
    let res = await postToDirectus(parsedValues);
    return c.json(res);
    // Post to directus
  }
  return c.json(parsedObject);
});
serve({
  fetch: app.fetch,
  port: 8787,
});
