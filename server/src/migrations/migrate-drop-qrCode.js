require("dotenv").config();
const { sequelize } = require("../db/postgres");

async function run() {
  try {
    console.log("🔧 Starting qrCode column removal migration...");

    await sequelize.query(`ALTER TABLE urls DROP COLUMN IF EXISTS "qrCode";`);
    console.log("✓ Removed qrCode column");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

run();
