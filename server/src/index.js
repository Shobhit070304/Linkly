require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/db.js");
const { getRedisClient } = require("./utils/redis-connection.js");

// Connect to MongoDB
connectDB();

//Routes
const urlRoutes = require("./routes/url-routes.js");
const userRoutes = require("./routes/user-routes.js");
const Url = require("./models/url-model.js");

//Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello from Backend");
});

app.use("/api/url", urlRoutes);
app.use("/api/user", userRoutes);




// Redirect to Long URL
app.get("/:shortUrl", async (req, res) => {
  const redisClient = getRedisClient();
  if (!redisClient) {
    return res
      .status(500)
      .json({ status: false, error: "Redis client not initialized" });
  }

  const { shortUrl } = req.params;

  try {
    // Check Redis cache
    const cachedUrl = await redisClient.hget("urls", shortUrl);

    if (cachedUrl) {
      // Check DB for limits and expiration
      const urlData = await Url.findOne({ shortUrl });

      if (!urlData) {
        return res.status(404).json({ status: false, error: "URL not found" });
      }

      const now = new Date();

      let isExpired = urlData.expiresAt && now > urlData.expiresAt;
      let isClickLimitReached = urlData.maxClicks && urlData.clicks >= urlData.maxClicks;

      // If expired or click limit reached, delete from Redis and DB
      if (isExpired) {
        await redisClient.hdel("urls", shortUrl);
        await Url.deleteOne({ shortUrl });
        return res.status(410).json({ status: false, error: "Link expired" });
      }
      if (isClickLimitReached) {
        await redisClient.hdel("urls", shortUrl);
        await Url.deleteOne({ shortUrl });
        return res.status(410).json({ status: false, error: "Click limit reached" });
      }

      await Url.updateOne({ shortUrl }, { $inc: { clicks: 1 } });

      return res.status(301).redirect(cachedUrl);
    }

    // Not in cache, check DB
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ status: false, error: "URL not found" });
    }

    // Expiration & click limit checks
    const now = new Date();

    let isExpired = url.expiresAt && now > url.expiresAt;
    let isClickLimitReached = url.maxClicks && url.clicks >= url.maxClicks;

    if (isExpired) {
      await redisClient.hdel("urls", shortUrl);
      await Url.deleteOne({ shortUrl });
      return res.status(410).json({ status: false, error: "Link expired" });
    }

    if (isClickLimitReached) {
      await redisClient.hdel("urls", shortUrl);
      await Url.deleteOne({ shortUrl });
      // It should be go to the client side and show a message that the click limit has been reached
      return res.status(410).json({ status: false, error: "Click limit reached" });
    }

    // Cache the result in Redis
    await redisClient.hset("urls", { [shortUrl]: url.longUrl });

    // Increment click count
    await url.updateOne({ $inc: { clicks: 1 } });

    return res.status(301).redirect(url.longUrl);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
});


module.exports = app;
