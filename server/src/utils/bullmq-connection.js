const IORedis = require("ioredis");
// BullMQ requires maxRetriesPerRequest: null — cannot use the general Redis client
const bullmqConnection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
module.exports = bullmqConnection;