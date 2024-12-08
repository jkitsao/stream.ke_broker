import { Hono } from "hono";
import axios from "axios";
const videos = new Hono();
// const testid = "319f3ecd-822f-474b-a83a-ed9c937ecfdf";
videos.get("/", (c) => c.text("List Video stats")); // GET /videos
videos.get("/stats/:id", async (c) => {
  // GET /videos/:id
  const id = c.req.param("id");
  const data = await fetchData(id);
  console.log(data);
  return c.json(data);
});

export default videos;

const fetchData = async (id) => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://video.bunnycdn.com/library/126262/videos/${id}`,
      headers: {
        AccessKey: "e59784cb-fcf3-43bf-b26a0ac304e1-bd76-4975",
      },
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
