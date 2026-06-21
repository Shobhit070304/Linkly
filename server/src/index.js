require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const { connectDB } = require("./db/postgres.js");
const { getRedisClient } = require("./utils/redis-connection.js");
const analyticsQueue = require("./queues/analyticsQueue.js");
require("./workers/analyticsWorker.js"); // Initialize worker
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

// Connect to PostgreSQL
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
    const link = await Url.findOne({ where: { shortUrl: shortCode } });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    const now = new Date();
    let isExpired = link.expiresAt && now > link.expiresAt;
    let isClickLimitReached = link.maxClicks && link.clicks >= link.maxClicks;

    if (isExpired || isClickLimitReached) {
      return res.status(410).json({ error: "Link expired or click limit reached" });
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
  const { shortUrl } = req.params;

  try {
    const redisClient = getRedisClient();
    // 1. Try fetching cached URL metadata from Redis first
    const cachedData = await redisClient.hget("url_metadata", shortUrl);
    let urlData;

    if (cachedData) {
      // Deserialize the cached Sequelize model JSON
      urlData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
    } else {
      // Cache Miss: Query PostgreSQL database
      const dbUrl = await Url.findOne({ where: { shortUrl } });
      if (!dbUrl) {
        return res.status(404).json({ status: false, error: "URL not found" });
      }
      urlData = dbUrl.toJSON();

      // Write to Redis to prevent future database reads
      await redisClient.hset("url_metadata", { [shortUrl]: JSON.stringify(urlData) });
      await redisClient.hset("urls", { [shortUrl]: urlData.longUrl });
    }

    // 2. Fetch or seed the click counter in Redis
    let cachedClicks = await redisClient.get(`clicks:${shortUrl}`);
    if (cachedClicks === null || cachedClicks === undefined) {
      await redisClient.set(`clicks:${shortUrl}`, urlData.clicks);
      cachedClicks = urlData.clicks;
    }
    
    // Increment the click counter in Redis
    const clicks = await redisClient.incr(`clicks:${shortUrl}`);

    // 3. Evaluate limits and expiration policies
    const now = new Date();
    let isExpired = urlData.expiresAt && now > new Date(urlData.expiresAt);
    let isClickLimitReached = urlData.maxClicks && clicks > urlData.maxClicks;

    // If expired or click limit reached, purge cache and redirect to preview/error
    if (isExpired || isClickLimitReached) {
      await redisClient.hdel("url_metadata", shortUrl);
      await redisClient.hdel("urls", shortUrl);
      await redisClient.del(`clicks:${shortUrl}`);
      return res.redirect(`${process.env.FRONTEND_URL}/preview/${urlData.shortUrl}`);
    }

    // 4. Asynchronously log analytics and sync click count to DB via BullMQ
    analyticsQueue.add("log-click", {
      urlId: urlData.id,
      ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip,
      userAgent: req.headers["user-agent"] || "",
      referrer: req.headers["referer"] || req.headers["referrer"] || "",
    });

    // Detect if request is from a crawler bot
    const userAgent = req.headers["user-agent"] || "";
    const isBot = /(facebook|twitter|whatsapp|linkedin|discord|bot|crawl|spider)/i.test(userAgent);

    if (isBot) {
      return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${urlData.title || "Short Link"}</title>
        <meta name="description" content="${urlData.description || ""}" />

        <!-- OpenGraph tags -->
        <meta property="og:title" content="${urlData.title || urlData.longUrl}" />
        <meta property="og:description" content="${urlData.description || ""}" />
        <meta property="og:url" content="${process.env.FRONTEND_URL}/${urlData.shortUrl}" />
        <meta property="og:image" content="${urlData.favicon || process.env.DEFAULT_PREVIEW_IMG}" />
        <meta property="og:type" content="website" />

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="${urlData.title || urlData.longUrl}" />
        <meta name="twitter:description" content="${urlData.description || ""}" />
        <meta name="twitter:image" content="${urlData.favicon || process.env.DEFAULT_PREVIEW_IMG}" />
      </head>
      <body>
        <p>Redirecting to ${urlData.longUrl}...</p>
        <script>
          setTimeout(() => {
            window.location.href = "${urlData.longUrl}";
          }, 2000);
        </script>
      </body>
      </html>
    `);
    }

    // ✅ Send users to frontend preview page consistently
    return res.redirect(`${process.env.FRONTEND_URL}/preview/${urlData.shortUrl}`);
  } catch (error) {
    if (error.message === "Redis client not initialized") {
      return res
        .status(500)
        .json({ status: false, error: "Redis client not initialized" });
    }
    console.error("Redirect error:", error);
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
