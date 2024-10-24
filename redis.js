import { createClient } from "redis";

const client = createClient({
  url: "redis://144.126.141.132:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

// set given value associated with the video id
async function setValue(id, event) {
  try {
    let res = await client.set(id, JSON.stringify(event));
    return res;
  } catch (error) {
    console.error(error);
  }
}
// Get given value
async function getValue(id) {
  try {
    let res = await client.get(id);
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export { setValue, getValue };
