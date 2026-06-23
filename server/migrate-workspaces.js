const { sequelize } = require("./src/db/postgres");

async function run() {
  try {
    console.log("Starting migration...");
    
    // Create workspaces table if it does not exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "apiKeyHash" VARCHAR(255) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✓ workspaces table checked/created.");

    // Add workspaceId to urls table if it does not exist
    await sequelize.query(`
      ALTER TABLE urls ADD COLUMN IF NOT EXISTS "workspaceId" UUID REFERENCES workspaces(id) ON DELETE CASCADE;
    `);
    console.log("✓ workspaceId column checked/added to urls table.");
    
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
