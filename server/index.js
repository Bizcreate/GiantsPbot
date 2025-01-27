const express = require("express");
const cors = require("cors");
const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new TwitterApi({
  appKey: "aKk1u2oMXrrsCTHDYPHBUnKJr",
  appSecret: "z2HpQcY6U6KU1AMiO39UgP3tN4MggaZ6DLYLN4C08MQTuuMZk7",
  accessToken: "1859991371257450496-YFPBb6BqQ0Xr5v2o34jgADmcKAvfSA",
  accessSecret: "dqpXznyvvBDolAH158Z2tT1f7R7n1KqPzoWTI0yFMxTm8",
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
          // Get likes with pagination to handle large numbers of likes
          const likes = await client.v2.tweetLikedBy(tweetId);

          // Check current page
          verified = likes.data?.some(
            (likeUser) =>
              likeUser.username.toLowerCase() === userHandle.toLowerCase()
          );
        } catch (error) {
          console.error("Error fetching likes:", error);
          verified = false;
        }
        break;

      case "comment":
        try {
          // Get tweet author for proper reply checking
          const tweet = await client.v2.singleTweet(tweetId, {
            expansions: ["author_id"],
          });

          // Search for replies using conversation_id and author
          const query = `conversation_id:${tweetId} from:${userHandle}`;
          const replies = await client.v2.search(query, {
            "tweet.fields": ["in_reply_to_user_id", "referenced_tweets"],
            max_results: 100,
          });

          // Verify that at least one tweet is a direct reply to our target tweet
          verified = replies.data?.some((reply) =>
            reply.referenced_tweets?.some(
              (ref) => ref.type === "replied_to" && ref.id === tweetId
            )
          );
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

          // Check if user follows author using Friendship lookup
          const followingResponse = await client.v2.followers(authorId, {
            max_results: 1000,
            "user.fields": ["username"],
          });

          // Check current page
          verified = followingResponse.data?.some(
            (follower) =>
              follower.username.toLowerCase() === userHandle.toLowerCase()
          );

          // If not found and there are more pages, check next pages
          let paginationToken = followingResponse.meta?.next_token;
          while (!verified && paginationToken) {
            const nextPage = await client.v2.followers(authorId, {
              max_results: 1000,
              pagination_token: paginationToken,
              "user.fields": ["username"],
            });
            verified = nextPage.data?.some(
              (follower) =>
                follower.username.toLowerCase() === userHandle.toLowerCase()
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
