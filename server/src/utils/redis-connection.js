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
            console.log("Connected to Redis successfully");
            return redisClient;
        } catch (error) {
            console.error(
                `Redis connection failed. Retries left: ${retries - 1}`,
                error
            );
            retries--;

            if (retries === 0) {
                console.error("Failed to connect to Redis after multiple attempts");
                process.exit(1);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

function getRedisClient() {
    if (!redisClient) {
        console.error("Redis client not initialized");
        process.exit(1);
    }
    return redisClient;
}

module.exports = { connectToRedis, getRedisClient };