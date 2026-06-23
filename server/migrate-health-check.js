require("dotenv").config();
const { sequelize } = require("./src/db/postgres");

async function run() {
  try {
    console.log("🔧 Starting health monitor migration...");

    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "monitorHealth" BOOLEAN DEFAULT TRUE;
    `);
    console.log("✓ Added monitorHealth column");

    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "isHealthy" BOOLEAN DEFAULT TRUE;
    `);
    console.log("✓ Added isHealthy column");

    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "healthStatus" VARCHAR(50) DEFAULT 'healthy';
    `);
    console.log("✓ Added healthStatus column");

    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "healthCheckFailureCount" INTEGER DEFAULT 0;
    `);
    console.log("✓ Added healthCheckFailureCount column");

    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "lastCheckedAt" TIMESTAMP WITH TIME ZONE;
    `);
    console.log("✓ Added lastCheckedAt column");

    console.log("\n✅ Health monitor migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
