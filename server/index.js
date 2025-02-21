const express = require("express");
const cors = require("cors");
const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new TwitterApi({
  appKey: "1MJM6tuh83gXKJD6kKBcYysAJ",
  appSecret: "LZpHvnvEAwwb8BY2v0gnEBLicq3k0UlIgj5zx1ohmMerB87JDo",
  accessToken: "1643909888349978624-z9AY7kunOyL8OlaLBme9y8E00woxTK",
  accessSecret: "OgMtvRNKelYVtWnpoG0koUv74co3lvcWl0HRecNh0rvZf",
});

app.post("/api/verify-twitter-action", async (req, res) => {
  try {
    const { tweetId, userHandle, actionType } = req.body;
    let verified = false;
    console.log(
      `Verifying ${actionType} for tweet ${tweetId} by user ${userHandle}`
    );

    // Get user ID from handle
    const user = await client.v2.userByUsername(userHandle);
    if (!user.data) {
      throw new Error("User not found");
    }
    const userId = user.data.id;

    switch (actionType) {
      case "like":
        try {
          const likes = await client.v2.tweetLikedBy(tweetId, {
            max_results: 100,
            "user.fields": ["username"],
          });

          // Check first page
          verified = likes.data?.some(
            (likeUser) =>
              likeUser.username.toLowerCase() === userHandle.toLowerCase()
          );

          // Check subsequent pages if necessary
          let paginationToken = likes.meta?.next_token;
          while (!verified && paginationToken) {
            const nextPage = await client.v2.tweetLikedBy(tweetId, {
              max_results: 100,
              pagination_token: paginationToken,
              "user.fields": ["username"],
            });
            verified = nextPage.data?.some(
              (likeUser) =>
                likeUser.username.toLowerCase() === userHandle.toLowerCase()
            );
            paginationToken = nextPage.meta?.next_token;
          }
        } catch (error) {
          console.error("Error fetching likes:", error);
          verified = false;
        }
        break;

      case "comment":
        try {
          const query = `in_reply_to_tweet_id:${tweetId} from:${userHandle}`;
          const replies = await client.v2.search(query);
          verified = replies.data?.length > 0;
        } catch (error) {
          console.error("Error fetching comments:", error);
          verified = false;
        }
        break;

      case "follow":
        try {
          // Get tweet author details
          const tweet = await client.v2.singleTweet(tweetId, {
            expansions: ["author_id"],
          });
          const authorId = tweet.data.author_id;

          // Check if user follows author
          const following = await client.v2.following(userId, {
            max_results: 1000,
            "user.fields": ["username"],
          });

          // Check if author is in the user's following list
          verified = following.data?.some(
            (followedUser) => followedUser.id === authorId
          );

          // Check subsequent pages if necessary
          let paginationToken = following.meta?.next_token;
          while (!verified && paginationToken) {
            const nextPage = await client.v2.following(userId, {
              max_results: 1000,
              pagination_token: paginationToken,
              "user.fields": ["username"],
            });
            verified = nextPage.data?.some(
              (followedUser) => followedUser.id === authorId
            );
            paginationToken = nextPage.meta?.next_token;
          }
        } catch (error) {
          console.error("Error checking follow:", error);
          verified = false;
        }
        break;

      case "retweet":
        try {
          const retweets = await client.v2.tweetRetweetedBy(tweetId, {
            "user.fields": ["username"],
            max_results: 100,
          });
          verified = retweets.data?.some(
            (retweetUser) =>
              retweetUser.username.toLowerCase() === userHandle.toLowerCase()
          );
        } catch (error) {
          console.error("Error checking retweet:", error);
          verified = false;
        }
        break;
    }

    console.log(`Verification result for ${userHandle}: ${verified}`);
    res.json({ verified, debug: { userId, actionType, tweetId } });
  } catch (error) {
    console.error("Twitter verification error:", error);
    if (error.rateLimit) {
      const resetTime = new Date(error.rateLimit.reset * 1000);
      console.log(`Rate limit will reset at: ${resetTime}`);
      console.log(
        `Time until reset: ${Math.ceil(
          (error.rateLimit.reset * 1000 - Date.now()) / 1000 / 60
        )} minutes`
      );
    }
    res.status(500).json({
      error: "Failed to verify Twitter action",
      details: error.message,
      data: error.data,
      rateLimit: error.rateLimit,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
