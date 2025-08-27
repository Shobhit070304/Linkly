const { getRedisClient } = require("../utils/redis-connection");
const encodeBase62 = require("../utils/helper");
const Url = require("../models/url-model");
const User = require("../models/user-model");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

module.exports.shortenUrl = async (req, res) => {
  const redisClient = getRedisClient();
  if (!redisClient) {
    return res
      .status(500)
      .json({ status: false, error: "Redis client not initialized" });
  }

  const { longUrl, customShort, maxClicks, expiresAt } = req.body;
  if (!longUrl) {
    return res
      .status(400)
      .json({ status: false, error: "Long URL is required" });
  }

  try {
    // Check in Redis
    const cached = await redisClient.hget("urls", longUrl);
    if (cached) {
      const { shortUrl, qrCode } = JSON.parse(cached);
      return res.status(200).json({
        status: true,
        shortUrl: process.env.BACKEND_URL + shortUrl,
        qrCode,
      });
    }

    // Check in DB
    const url = await Url.findOne({ longUrl });
    if (url) {
      const shortUrl = url.customShort || url.shortUrl;
      // repopulate cache with qrCode too
      await redisClient.hset("urls", {
        [longUrl]: JSON.stringify({
          shortUrl,
          qrCode: url.qrCode,
        }),
      });
      return res.status(200).json({
        status: true,
        shortUrl: process.env.BACKEND_URL + shortUrl,
        qrCode: url.qrCode,
      });
    }

    // Generate new shortUrl
    let shortUrl;
    if (customShort) {
      shortUrl = customShort;
    } else {
      const id = await redisClient.incr("counter");
      shortUrl = encodeBase62(id);
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    // Check custom short availability
    if (customShort) {
      const isCustomShortAvailable = await Url.findOne({
        customShort,
      });
      if (isCustomShortAvailable) {
        return res.json({
          status: false,
          message: "Custom short URL not available. Use a different one.",
        });
      }
    }

    // Generate QR
    const fullShortUrl = process.env.BACKEND_URL + shortUrl;
    const qrCode = await QRCode.toDataURL(fullShortUrl);

    // Save in DB
    const newUrl = await Url.create({
      customShort: customShort || "",
      shortUrl,
      longUrl,
      user: user._id,
      clicks: 0,
      qrCode,
      maxClicks: maxClicks || undefined,
      expiresAt: expiresAt || undefined,
    });
    user.urls.push(newUrl._id);
    await user.save();

    // Save in Redis
    await redisClient.hset("urls", {
      [longUrl]: JSON.stringify({ shortUrl, qrCode }),
    });

    return res.status(200).json({
      status: true,
      shortUrl: process.env.BACKEND_URL + shortUrl,
      qrCode,
    });
  } catch (error) {
    console.error("Shorten error:", error);
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};

module.exports.originalUrl = async (req, res) => {
  //Redis Client Connection
  const redisClient = getRedisClient();
  if (!redisClient) {
    return res
      .status(500)
      .json({ status: false, error: "Redis client not initialized" });
  }

  //Short URL
  const { shortUrl } = req.body;
  if (!shortUrl) {
    return res
      .status(400)
      .json({ status: false, error: "Short URL is required" });
  }
  try {
    //Check for url in redis cache
    const cachedUrl = await redisClient.hget("urls", shortUrl);
    if (cachedUrl) {
      return res.status(200).json({ status: true, longUrl: cachedUrl });
    } else {
      const url = await Url.findOne({ shortUrl: shortUrl });
      if (url) {
        await redisClient.hset("urls", {
          [url.shortUrl]: url.longUrl,
        });
        return res.status(200).json({ status: true, longUrl: url.longUrl });
      } else {
        return res.status(404).json({ status: false, error: "URL not found" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};

module.exports.getMyUrls = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate("urls");
    return res.status(200).json({ status: true, urls: user.urls });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};

module.exports.deleteUrl = async (req, res) => {
  //Redis Client Connection
  const redisClient = getRedisClient();
  if (!redisClient) {
    return res
      .status(500)
      .json({ status: false, error: "Redis client not initialized" });
  }

  //Short URL
  const { shortUrl } = req.body;
  if (!shortUrl) {
    return res
      .status(400)
      .json({ status: false, error: "Short URL is required" });
  }

  try {
    // Remove from Redis if cached
    const cachedUrl = await redisClient.hget("urls", shortUrl);
    if (cachedUrl) {
      await redisClient.hdel("urls", shortUrl);
    }

    // Find the URL
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(404).json({ status: false, error: "URL not found" });
    }

    // Delete from DB
    await Url.deleteOne({ shortUrl });
    await User.findByIdAndUpdate(url.user, { $pull: { urls: url._id } });

    return res
      .status(200)
      .json({ status: true, message: "URL deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: "Internal Server Error" });
  }
};
