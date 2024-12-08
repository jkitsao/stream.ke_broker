import axios from "axios";
import sharp from "sharp";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
// when given creator id find all
const getContent = async () => {
  // console.log(`fetching folllowers for ${creator}`);
  const DIRECTUS_API_URL = `https://api.streamke.site/items/content`;
  // console.log(JSON.stringify({ parsedValue }));
  try {
    // Post the data to Directus API
    const response = await fetch(DIRECTUS_API_URL);
    if (!response.ok) {
      // Log detailed response error
      const errorData = await response.json(); // Parse the response body for error details
      console.error("Failed to get followers from Directus:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        `Failed to fetch followers: ${
          errorData?.errors?.[0]?.message || "Unknown error"
        }`
      );
    }
    let data = await response.json();
    let images = getRandomThumbnails(data.data);
    // console.log(JSON.stringify(images, null, 2));
    try {
      const collage = await createCollage(images);
      // Get the directory name of the current module
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      const staticDir = join(__dirname, "static");

      if (!existsSync(staticDir)) {
        mkdirSync(staticDir);
      }

      writeFileSync(join(staticDir, "collage.jpg"), collage);
      console.log("Collage saved as collage.jpg");
    } catch (error) {
      console.error("Failed to create collage:", error.message);
    }
    // Possibly notify creator
    // return data.data; // Return the parsed JSON response
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export default getContent;
function getRandomThumbnails(data) {
  const baseUrl = "https://api.streamke.site/assets/";

  // Filter out items where creator_thumbnail is null
  const validThumbnails = data
    .map((item) => item.creator_thumbnail)
    .filter((thumbnail) => thumbnail !== null);

  // Shuffle and pick four random thumbnails
  const randomThumbnails = validThumbnails
    .sort(() => Math.random() - 0.5) // Shuffle array
    .slice(0, 4); // Take the first 4

  // Concatenate with base URL
  const result = randomThumbnails.map((thumbnail) => baseUrl + thumbnail);

  return result;
}

async function createCollage(data) {
  const baseUrl = "https://api.streamke.site/assets/";

  try {
    // Filter valid thumbnails and shuffle to get four random URLs
    const imageUrls = data;

    if (imageUrls.length < 4) {
      throw new Error("Not enough valid thumbnails to create a collage.");
    }

    // Fetch and resize images
    const resizedImages = await Promise.all(
      imageUrls.map(async (url) => {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        return sharp(response.data).resize(320, 180).toBuffer(); // Resize to 200x200
      })
    );

    // Create the collage
    const collage = await sharp({
      create: {
        width: 640,
        height: 360,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }, // White background
      },
    })
      .composite([
        { input: resizedImages[0], top: 0, left: 0 },
        { input: resizedImages[1], top: 0, left: 320 },
        { input: resizedImages[2], top: 180, left: 0 },
        { input: resizedImages[3], top: 180, left: 320 },
      ])
      .jpeg()
      .toBuffer();

    return collage; // Returns a Buffer of the JPEG image
  } catch (error) {
    console.error("Error creating collage:", error.message);
    throw error; // Rethrow error for handling in the calling code
  }
}
