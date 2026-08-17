require("dotenv").config();
const { sequelize } = require("./src/db/postgres");

async function run() {
  try {
    console.log("🔧 Starting single email notification flag migration...");

    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "isEmailNotified" BOOLEAN DEFAULT FALSE;
    `);
    console.log("✓ Added isEmailNotified column");

    console.log("\n✅ Email notification migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
