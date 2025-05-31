const { getRedisClient } = require("../utils/redis-connection");
const encodeBase62 = require("../utils/helper");
const Url = require("../models/url-model");
const User = require("../models/user-model");

module.exports.shortenUrl = async (req, res) => {
    console.log("Hello from shortenUrl");
    console.log(req.body);
    console.log(req.user);
    //Redis Client Connection
    const redisClient = getRedisClient();
    if (!redisClient) {
        return res
            .status(500)
            .json({ status: false, error: "Redis client not initialized" });
    }

    //Long URL
    const { longUrl, customShort, maxClicks, expiresAt } = req.body;
    if (!longUrl) {
        return res
            .status(400)
            .json({ status: false, error: "Long URL is required" });
    }

    try {
        // Check for url in redis cache
        const cachedUrl = await redisClient.hget("urls", longUrl);
        if (cachedUrl) {
            return res.status(200).json({ status: true, shortUrl: process.env.BACKEND_URL + cachedUrl });
        }
        else {
            // Check for url in database
            const url = await Url.findOne({ longUrl: longUrl });
            if (url) {
                let shortUrl;
                if (url.customShort !== "") {
                    shortUrl = url.customShort;
                }
                else {
                    shortUrl = url.shortUrl;
                }
                await redisClient.hset("urls", {
                    [shortUrl]: url.longUrl,
                });
                return res.status(200).json({ status: true, shortUrl: process.env.BACKEND_URL + shortUrl });
            }
            else {
                // Generate new short url
                let shortUrl;
                if (customShort) {
                    shortUrl = customShort;
                }
                else {
                    const id = await redisClient.incr("counter");
                    shortUrl = encodeBase62(id);
                }
                await redisClient.hset("urls", {
                    [shortUrl]: longUrl,
                });

                const user = await User.findOne({ email: req.user.email });

                if (!user) {
                    return res.status(404).json({ status: false, error: "User not found" });
                }
                else {
                    let isCustomShortAvailable = await Url.findOne({ user: user._id, customShort: shortUrl });
                    if (isCustomShortAvailable) {
                        return res.json({ status: false, message: "Custom short URL not available. Use a different one." });
                    }
                    const newUrl = await Url.create({
                        customShort: customShort,
                        shortUrl: shortUrl,
                        longUrl: longUrl,
                        user: user._id,
                        clicks: 0,
                        maxClicks: maxClicks || undefined,
                        expiresAt: expiresAt || undefined,
                    });
                    user.urls.push(newUrl._id);
                    await user.save();
                }
                return res.status(200).json({ status: true, shortUrl: process.env.BACKEND_URL + shortUrl });
            }
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
}

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
        }
        else {
            const url = await Url.findOne({ shortUrl: shortUrl });
            if (url) {
                await redisClient.hset("urls", {
                    [url.shortUrl]: url.longUrl,
                });
                return res.status(200).json({ status: true, longUrl: url.longUrl });
            }
            else {
                return res.status(404).json({ status: false, error: "URL not found" });
            }
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: false, error: "Internal Server Error" });
    }
}

module.exports.getMyUrls = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).populate("urls");
        return res.status(200).json({ status: true, urls: user.urls });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Internal Server Error" });
    }
}

module.exports.deleteUrl = async (req, res) => {
    //Redis Client Connection
    const redisClient = getRedisClient();
    if (!redisClient) {
        return res.status(500).json({ status: false, error: "Redis client not initialized" });
    }

    //Short URL
    const { shortUrl } = req.body;
    if (!shortUrl) {
        return res.status(400).json({ status: false, error: "Short URL is required" });
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

        return res.status(200).json({ status: true, message: "URL deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};



