const { getRedisClient } = require("../utils/redis-connection");
const { URL } = require("url");
const encodeBase62 = require("../utils/helper");
const Url = require("../models/url-model");
const User = require("../models/user-model");
const QRCode = require("qrcode");
const ogs = require("open-graph-scraper");

module.exports.shortenUrl = async (req, res) => {
  const { longUrl, customShort, maxClicks, expiresAt } = req.body;
  if (!longUrl) {
    return res
      .status(400)
      .json({ status: false, error: "Long URL is required" });
  }

  try {
    const redisClient = getRedisClient();

    // Validate URL format and protocol
    try {
      const parsedUrl = new URL(longUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return res
          .status(400)
          .json({ status: false, error: "Only http and https protocols are supported" });
      }
    } catch (urlError) {
      return res
        .status(400)
        .json({ status: false, error: "Invalid URL format" });
    }

    // Check custom short availability first to prevent database/counter race conditions
    if (customShort) {
      const isCustomShortAvailable = await Url.findOne({
        where: { shortUrl: customShort },
      });
      if (isCustomShortAvailable) {
        return res.status(409).json({
          status: false,
          error: "Custom short URL not available. Use a different one.",
          message: "Custom short URL not available. Use a different one.",
        });
      }
    }

    // Generate new shortUrl
    let shortUrl;
    if (customShort) {
      shortUrl = customShort;
    } else {
      const id = await redisClient.incr("counter");
      shortUrl = encodeBase62(id);
    }

    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    // Fetch meta info
    let meta = {};
    try {
      const { result } = await ogs({ url: longUrl });
      meta = {
        title: result.ogTitle || result.twitterTitle || longUrl,
        description: result.ogDescription || "",
        favicon: result.favicon || "",
      };
    } catch (err) {
      meta = { title: longUrl, description: "", favicon: "" };
    }

    // Generate QR
    const fullShortUrl = process.env.BACKEND_URL + shortUrl;
    const qrCode = await QRCode.toDataURL(fullShortUrl);

    // Save in DB
    const newUrl = await Url.create({
      customShort: customShort || "",
      shortUrl,
      longUrl,
      userId: user.id,
      clicks: 0,
      qrCode,
      maxClicks: maxClicks || null,
      expiresAt: expiresAt || null,
      ...meta,
    });

    // Save in Redis using shortUrl as key (consistent with redirect logic)
    await redisClient.hset("urls", {
      [shortUrl]: longUrl, // Store the actual long URL for redirect
    });
    
    // Cache URL metadata details for the redirect path
    await redisClient.hset("url_metadata", {
      [shortUrl]: JSON.stringify(newUrl.toJSON()),
    });

    // Seed click counter in Redis
    await redisClient.set(`clicks:${shortUrl}`, 0);

    return res.status(200).json({
      status: true,
      shortUrl: process.env.BACKEND_URL + shortUrl,
      qrCode,
    });
  } catch (error) {
    if (error.message === "Redis client not initialized") {
      return res
        .status(500)
        .json({ status: false, error: "Redis client not initialized" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: false,
        error: "Custom short URL not available. Use a different one.",
        message: "Custom short URL not available. Use a different one.",
      });
    }
    console.error("Shorten error:", error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};

module.exports.originalUrl = async (req, res) => {
  //Short URL
  const { shortUrl } = req.body;
  if (!shortUrl) {
    return res
      .status(400)
      .json({ status: false, error: "Short URL is required" });
  }
  try {
    //Redis Client Connection
    const redisClient = getRedisClient();

    let urlData;
    // 1. Fetch metadata from Redis first
    const cachedData = await redisClient.hget("url_metadata", shortUrl);
    if (cachedData) {
      urlData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
    } else {
      // Cache miss: Query Postgres DB
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
      // Fetch latest clicks directly from Postgres DB to prevent desync
      const freshUrl = await Url.findOne({
        where: { shortUrl },
        attributes: ["clicks"],
      });
      const dbClicks = freshUrl ? freshUrl.clicks : 0;
      await redisClient.set(`clicks:${shortUrl}`, dbClicks);
      cachedClicks = dbClicks;
    }

    // 3. Evaluate limits and expiration policies
    const now = new Date();
    let isExpired = urlData.expiresAt && now > new Date(urlData.expiresAt);
    let isClickLimitReached = urlData.maxClicks && Number(cachedClicks) > urlData.maxClicks;

    // If expired or click limit reached, purge cache and return error
    if (isExpired || isClickLimitReached) {
      await redisClient.hdel("url_metadata", shortUrl);
      await redisClient.hdel("urls", shortUrl);
      await redisClient.del(`clicks:${shortUrl}`);
      return res.status(403).json({
        status: false,
        error: "URL has expired or click limit has been reached.",
        message: "URL has expired or click limit has been reached.",
      });
    }

    return res.status(200).json({ status: true, longUrl: urlData.longUrl });
  } catch (error) {
    if (error.message === "Redis client not initialized") {
      return res
        .status(500)
        .json({ status: false, error: "Redis client not initialized" });
    }
    console.error("Original URL error:", error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};

module.exports.getMyUrls = async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { email: req.user.email },
      include: [{ model: Url, as: 'urls' }]
    });
    return res.status(200).json({ status: true, urls: user.urls });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};

module.exports.deleteUrl = async (req, res) => {
  //Short URL
  const { shortUrl } = req.body;
  if (!shortUrl) {
    return res
      .status(400)
      .json({ status: false, error: "Short URL is required" });
  }

  try {
    //Redis Client Connection
    const redisClient = getRedisClient();

    // Find the logged-in user to verify ownership
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    // Find the URL
    const url = await Url.findOne({ where: { shortUrl } });
    if (!url) {
      return res.status(404).json({ status: false, error: "URL not found" });
    }

    // Check ownership
    if (url.userId !== user.id) {
      return res.status(403).json({
        status: false,
        error: "Unauthorized: You do not own this URL",
        message: "Unauthorized: You do not own this URL",
      });
    }

    // Remove associated keys from Redis if cached
    await redisClient.hdel("urls", shortUrl);
    await redisClient.hdel("url_metadata", shortUrl);
    await redisClient.del(`clicks:${shortUrl}`);

    // Delete from DB
    await Url.destroy({ where: { shortUrl } });

    return res
      .status(200)
      .json({ status: true, message: "URL deleted successfully" });
  } catch (error) {
    if (error.message === "Redis client not initialized") {
      return res
        .status(500)
        .json({ status: false, error: "Redis client not initialized" });
    }
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};
