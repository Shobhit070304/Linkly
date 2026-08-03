require("dotenv").config();
const { sequelize } = require("../db/postgres");

async function run() {
  try {
    console.log("🔧 Starting password column & monitorHealth default migration...");

    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "password" VARCHAR(255);
    `);
    console.log("✓ Added password column");

    await sequelize.query(`
      ALTER TABLE urls ALTER COLUMN "monitorHealth" SET DEFAULT FALSE;
    `);
    console.log("✓ Updated monitorHealth default to FALSE");

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
