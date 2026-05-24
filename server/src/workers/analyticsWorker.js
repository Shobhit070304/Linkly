const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { logClick } = require("../utils/analytics");
require("dotenv").config();

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

// Create the worker
const analyticsWorker = new Worker(
    "analytics",
    async (job) => {
        const { urlId, ipAddress, userAgent, referrer } = job.data;
        // console.log(`[Worker] Processing job ${job.id} for URL ${urlId}`);
        await logClick(urlId, ipAddress, userAgent, referrer);
    },
    {
        connection,
    }
);

analyticsWorker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
});

analyticsWorker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job.id} failed with error ${err.message}`);
});

module.exports = analyticsWorker;
