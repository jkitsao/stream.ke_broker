const DIRECTUS_API_URL = "https://api.streamke.site/items/content";
const postToDirectus = async (parsedValue) => {
  console.log(JSON.stringify({ parsedValue }));
  try {
    // Post the data to Directus API
    const response = await fetch(DIRECTUS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedValue),
    });
    if (!response.ok) {
      throw new Error("Failed to post to Directus");
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};
export default postToDirectus;
