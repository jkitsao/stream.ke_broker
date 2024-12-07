// when given creator id find all
const getFollowersId = async (creator) => {
  const DIRECTUS_API_URL = `https://api.streamke.site/items/follows?filter[creator][_eq]=${creator}`;
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
    console.log(JSON.stringify(data.data, null, 2));
    // Possibly notify creator
    return data.data; // Return the parsed JSON response
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
export default getFollowersId;
// export default postToDirectus;
// let CustomerEmailData = {
//     recepient: user?.email,
//     name: `${user?.first_name} ${user?.last_name}`,
//     video_name: video?.title,
//     video_description: video?.description,
//     video_id: video?.video_id,
// add creator
//   };
