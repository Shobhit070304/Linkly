const { Queue } = require("bullmq");
const IORedis = require("ioredis");
require("dotenv").config();

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const analyticsQueue = new Queue("analytics", {
    connection,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 1000, // 1s, 2s, 4s, 8s, 16s...
        },
        removeOnComplete: true, // Don't keep successful jobs in memory forever
        removeOnFail: false, // Keep failed jobs so we can inspect them
    },
});

module.exports = analyticsQueue;
