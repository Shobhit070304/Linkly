require("dotenv").config();
const { Redis } = require("@upstash/redis");

const MAX_RETRIES = 5;
let redisClient = null;

async function connectToRedis(retries = MAX_RETRIES) {
    while (retries > 0) {
        try {
            redisClient = new Redis({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });

            await redisClient.ping();
            return redisClient;
        } catch (error) {
            retries--;

            if (retries === 0) {
                process.exit(1);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

function getRedisClient() {
    if (!redisClient) {
        process.exit(1);
    }
    return redisClient;
}

module.exports = { connectToRedis, getRedisClient };