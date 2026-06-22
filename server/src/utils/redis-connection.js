require("dotenv").config();
const Redis = require("ioredis");

const MAX_RETRIES = 5;
let redisClient = null;

async function connectToRedis(retries = MAX_RETRIES) {
    while (retries > 0) {
        try {
            redisClient = new Redis(process.env.REDIS_URL);
            
            redisClient.on('error', (err) => {
                console.error('Redis client error:', err.message);
            });

            await redisClient.ping();
            console.log('✅ Redis connected successfully');
            return redisClient;
        } catch (error) {
            retries--;
            console.error(`❌ Redis connection failed. Retries left: ${retries}`, error.message);

            if (redisClient) {
                try {
                    redisClient.disconnect();
                } catch (_) {}
            }

            if (retries === 0) {
                console.error('❌ Redis connection failed after all retries. Exiting...');
                process.exit(1);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
}

module.exports = { connectToRedis, getRedisClient };