const EMAIL_API_URL = "https://stream.ke/api/emails/notify";

const requestEmail = async (data) => {
  console.log("Email request initiated");
  // console.log(JSON.stringify({ parsedValue }));
  try {
    // Post the data to Directus API
    const response = await fetch(EMAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Log detailed response error
      const errorData = await response.json(); // Parse the response body for error details
      console.error("Failed to send mail", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(
        `Failed to send Email: ${
          errorData?.errors?.[0]?.message || "Unknown error"
        }`
      );
    }
    console.log("Mail has been sent ");
    return await response.json(); // Return the parsed JSON response
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export default requestEmail;
