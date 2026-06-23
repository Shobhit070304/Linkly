const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const axios = require("axios");
const { Op } = require("sequelize");
const Url = require("../models/url-model");
require("dotenv").config();

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// How many consecutive failures before marking a link as "broken"
const FAILURE_THRESHOLD = 3;

// Timeout for each HTTP ping (milliseconds)
const PING_TIMEOUT_MS = 5000;

// A realistic browser User-Agent to avoid 403 blocks from Cloudflare / bot-protection
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Performs a HEAD request to the URL, falls back to GET if HEAD is rejected.
 * Returns { alive: boolean, statusCode: number | null, error: string | null }
 */
async function pingUrl(longUrl) {
  const config = {
    timeout: PING_TIMEOUT_MS,
    headers: { "User-Agent": BROWSER_USER_AGENT },
    // Follow redirects (e.g. http -> https) — max 5 hops
    maxRedirects: 5,
    // Don't throw on 4xx/5xx status codes — we handle them ourselves
    validateStatus: () => true,
  };

  try {
    // Attempt 1: HEAD request (fastest — no body download)
    const response = await axios.head(longUrl, config);

    // Some servers reject HEAD with 405; fallback to GET in that case
    if (response.status === 405) {
      const getResponse = await axios.get(longUrl, config);
      return { alive: getResponse.status < 500, statusCode: getResponse.status, error: null };
    }

    // 2xx and 3xx are alive. 4xx/5xx means broken.
    return { alive: response.status < 500, statusCode: response.status, error: null };
  } catch (err) {
    // Network errors: DNS failure, connection refused, timeout
    return { alive: false, statusCode: null, error: err.message };
  }
}

const healthWorker = new Worker(
  "health-checks",
  async (job) => {
    // ─────────────────────────────────────────────────
    // JOB TYPE 1: Master Scheduler Job
    // Fetches all URLs that should be monitored and enqueues individual check jobs
    // ─────────────────────────────────────────────────
    if (job.name === "run-health-checks") {
      console.log("[Health] Master job triggered — fetching URLs to check...");

      const now = new Date();

      // Only fetch URLs that:
      // 1. User opted into monitoring (monitorHealth = true)
      // 2. Are not already broken (isHealthy = true) — broken links are handled by manual "Re-verify"
      // 3. Are not expired
      // 4. Have not hit their click limit
      const urlsToCheck = await Url.findAll({
        where: {
          monitorHealth: true,
          isHealthy: true,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: now } },
          ],
        },
        attributes: ["id", "longUrl", "shortUrl", "healthCheckFailureCount"],
      });

      if (urlsToCheck.length === 0) {
        console.log("[Health] No URLs to check right now.");
        return;
      }

      console.log(`[Health] Enqueuing ${urlsToCheck.length} URL check jobs...`);

      // Import the queue here to avoid circular dependency at module load time
      const healthQueue = require("../queues/healthQueue");

      // Bulk-add all check jobs to the queue for parallel processing
      const jobs = urlsToCheck.map((url) => ({
        name: "check-single-url",
        data: {
          urlId: url.id,
          longUrl: url.longUrl,
          shortUrl: url.shortUrl,
        },
        opts: { 
          jobId: `check-${url.id}`, 
          attempts: FAILURE_THRESHOLD, 
          backoff: { type: "exponential", delay: 5000 } 
        },
      }));

      await healthQueue.addBulk(jobs);
      console.log(`[Health] ✅ Enqueued ${jobs.length} check jobs.`);
      return;
    }

    // ─────────────────────────────────────────────────
    // JOB TYPE 2: Individual URL Check Job
    // Pings one URL and updates its health status in the DB
    // ─────────────────────────────────────────────────
    if (job.name === "check-single-url") {
      const { urlId, longUrl, shortUrl } = job.data;

      // Always fetch fresh failure count from DB, as job.data might be stale on BullMQ retries
      const urlRecord = await Url.findByPk(urlId, { attributes: ["healthCheckFailureCount", "isHealthy"] });
      if (!urlRecord || !urlRecord.isHealthy) return; // Ignore if already broken or deleted

      const currentFailureCount = urlRecord.healthCheckFailureCount;

      const { alive, statusCode, error } = await pingUrl(longUrl);

      if (alive) {
        // ✅ Site is back online — reset all failure counters
        await Url.update(
          {
            isHealthy: true,
            healthStatus: "healthy",
            healthCheckFailureCount: 0,
            lastCheckedAt: new Date(),
          },
          { where: { id: urlId } }
        );
        console.log(`[Health] ✅ ${shortUrl} (${longUrl}) → HEALTHY (${statusCode})`);
      } else {
        // ❌ Check failed — increment failure count
        const newFailureCount = currentFailureCount + 1;
        const isBroken = newFailureCount >= FAILURE_THRESHOLD;

        await Url.update(
          {
            healthCheckFailureCount: newFailureCount,
            lastCheckedAt: new Date(),
            ...(isBroken && {
              isHealthy: false,
              healthStatus: "broken",
            }),
          },
          { where: { id: urlId } }
        );

        if (isBroken) {
          console.warn(
            `[Health] 🔴 ${shortUrl} (${longUrl}) → BROKEN after ${newFailureCount} failures.`
          );
        } else {
          console.warn(
            `[Health] ⚠️  ${shortUrl} (${longUrl}) → Failed (${error || statusCode}). Failure ${newFailureCount}/${FAILURE_THRESHOLD}`
          );
          // Throw an error to trigger BullMQ's automatic backoff retry!
          throw new Error(`Target unreachable: ${error || statusCode}`);
        }
      }
    }
  },
  { connection }
);

healthWorker.on("failed", (job, err) => {
  console.error(`[Health Worker] Job "${job?.name}" (${job?.id}) failed: ${err.message}`);
});

module.exports = healthWorker;
