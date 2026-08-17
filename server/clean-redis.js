require("dotenv").config();
const Redis = require("ioredis");

async function cleanRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.error("❌ REDIS_URL environment variable is missing in server/.env");
    process.exit(1);
  }

  console.log("🔄 Connecting to Redis...");
  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });

  try {
    await redis.ping();
    console.log("✅ Connected to Redis successfully!\n");

    // Check if --all or --flushdb flag is provided
    const isFlushAll = process.argv.includes("--all") || process.argv.includes("--flushdb");

    if (isFlushAll) {
      console.log("⚠️  Flushing ENTIRE database (FLUSHDB)...");
      await redis.flushdb();
      console.log("✨ All Redis keys have been completely cleared!");
    } else {
      console.log("🔍 Scanning and clearing Linkly-specific keys...");

      // 1. Delete Linkly hash maps & counters
      const explicitKeys = ["urls", "url_metadata", "counter"];
      let deletedExplicit = 0;

      for (const key of explicitKeys) {
        const exists = await redis.exists(key);
        if (exists) {
          await redis.del(key);
          console.log(`  🗑️  Deleted key: ${key}`);
          deletedExplicit++;
        }
      }

      // 2. Scan and delete patterned keys (e.g. clicks:* and bull:* queues)
      const patterns = ["clicks:*", "bull:analytics:*", "bull:health-checks:*"];
      let patternDeletedCount = 0;

      for (const pattern of patterns) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
          console.log(`  🗑️  Deleted ${keys.length} keys matching pattern: "${pattern}"`);
          patternDeletedCount += keys.length;
        }
      }

      console.log(`\n✨ Clean-up complete! Removed ${deletedExplicit + patternDeletedCount} keys in total.`);
      console.log("💡 Tip: To wipe the entire database, run: node clean-redis.js --all");
    }
  } catch (error) {
    console.error("❌ Error cleaning Redis:", error.message);
  } finally {
    await redis.quit();
    process.exit(0);
  }
}

cleanRedis();
