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
      // Log detailed response error
      const errorData = await response.json(); // Parse the response body for error details
      console.error("Failed to post to Directus:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        `Failed to post to Directus: ${
          errorData?.errors?.[0]?.message || "Unknown error"
        }`
      );
    }

    return await response.json(); // Return the parsed JSON response
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export default postToDirectus;
