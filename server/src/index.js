require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const connectDB = require("./db/db.js");
const { getRedisClient } = require("./utils/redis-connection.js");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Security and performance middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use(limiter);

// Use Helmet for security headers
app.use(helmet());

// Use compression for all responses
app.use(compression());

// Connect to MongoDB
connectDB();

//Routes
const urlRoutes = require("./routes/url-routes.js");
const userRoutes = require("./routes/user-routes.js");
const Url = require("./models/url-model.js");

//Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));

//  Logging
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello from Backend");
});

// API Routes - these must come before the wildcard route
app.use("/api/url", urlRoutes);
app.use("/api/user", userRoutes);

// API route for getting link metadata
app.get("/api/links/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const link = await Url.findOne({ shortUrl: shortCode });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json({
      longUrl: link.longUrl,
      title: link.title || "",
      description: link.description || "",
      favicon: link.favicon || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect to Long URL (wildcard route - must be after all specific routes)
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
      let isClickLimitReached =
        urlData.maxClicks && urlData.clicks >= urlData.maxClicks;

      // If expired or click limit reached, delete from Redis and DB
      if (isExpired) {
        await redisClient.hdel("urls", shortUrl);
        await Url.deleteOne({ shortUrl });
        return res.status(410).json({ status: false, error: "Link expired" });
      }
      if (isClickLimitReached) {
        await redisClient.hdel("urls", shortUrl);
        await Url.deleteOne({ shortUrl });
        return res
          .status(410)
          .json({ status: false, error: "Click limit reached" });
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
      return res
        .status(410)
        .json({ status: false, error: "Click limit reached" });
    }

    // Cache the result in Redis
    await redisClient.hset("urls", { [shortUrl]: url.longUrl });

    // Increment click count
    await url.updateOne({ $inc: { clicks: 1 } });

    // Detect if request is from a crawler bot
    const userAgent = req.headers["user-agent"] || "";
    const isBot =
      /(facebook|twitter|whatsapp|linkedin|discord|bot|crawl|spider)/i.test(
        userAgent
      );

    if (isBot) {
      return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${url.title || "Short Link"}</title>
        <meta name="description" content="${url.description || ""}" />

        <!-- OpenGraph tags -->
        <meta property="og:title" content="${url.title || url.longUrl}" />
        <meta property="og:description" content="${url.description || ""}" />
        <meta property="og:url" content="${process.env.FRONTEND_URL}/${url.shortUrl
        }" />
        <meta property="og:image" content="${url.favicon || process.env.DEFAULT_PREVIEW_IMG
        }" />
        <meta property="og:type" content="website" />

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="${url.title || url.longUrl}" />
        <meta name="twitter:description" content="${url.description || ""}" />
        <meta name="twitter:image" content="${url.favicon || process.env.DEFAULT_PREVIEW_IMG
        }" />
      </head>
      <body>
        <p>Redirecting to ${url.longUrl}...</p>
        <script>
          setTimeout(() => {
            window.location.href = "${url.longUrl}";
          }, 2000);
        </script>
      </body>
      </html>
    `);
    }

    // return res.status(301).redirect(url.longUrl);

    // ✅ Instead of redirecting, send users to frontend preview page
    return res.redirect(`${process.env.FRONTEND_URL}/preview/${url.shortUrl}`);
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
});

// 404 handler - must be after all routes
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Resource not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: false,
    message: err.message,
  });
});

module.exports = app;
