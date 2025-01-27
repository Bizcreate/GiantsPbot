import axios from "axios";

export const verifyTwitterAction = async (tweetId, userHandle, actionType) => {
  try {
    console.log(
      `Attempting to verify ${actionType} for tweet ${tweetId} by user ${userHandle}`
    );

    const response = await axios.post("/api/verify-twitter-action", {
      tweetId,
      userHandle: userHandle.replace("@", ""),
      actionType,
    });

    console.log("Full API response:", response.data);

    if (response.data.error) {
      console.error("API Error:", response.data.error);
      return false;
    }

    return response.data.verified;
  } catch (error) {
    console.error("Twitter verification error:", error.response?.data || error);
    return false;
  }
};
