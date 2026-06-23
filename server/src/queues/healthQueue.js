const { Queue } = require("bullmq");
const IORedis = require("ioredis");
require("dotenv").config();

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const healthQueue = new Queue("health-checks", {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry each individual check up to 3 times before giving up
    backoff: {
      type: "exponential",
      delay: 2000, // 2s, 4s, 8s...
    },
    removeOnComplete: true,
    removeOnFail: true, // Health check failures are expected; don't pollute the failed job list
  },
});

// Register the repeatable master job: runs every 5 mins in dev, every 1 hour in prod
const CRON_SCHEDULE =
  process.env.NODE_ENV === "production" ? "0 * * * *" : "*/5 * * * *";

healthQueue
  .add(
    "run-health-checks",
    {}, // No payload needed — worker fetches URLs from DB itself
    {
      repeat: { pattern: CRON_SCHEDULE },
      jobId: "master-health-check", // Stable job ID prevents duplicate repeatable jobs on restart
    }
  )
  .then(() => {
    console.log(
      `✅ Health monitor cron registered (${CRON_SCHEDULE === "0 * * * *" ? "hourly" : "every 5 mins"})`
    );
  })
  .catch((err) => {
    console.error("❌ Failed to register health monitor cron:", err.message);
  });

module.exports = healthQueue;
