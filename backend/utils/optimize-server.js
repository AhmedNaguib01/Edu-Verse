/**
 * Server optimization script
 * Run this to apply all performance optimizations
 */

const { createIndexes } = require("../database/indexes");
const connectDB = require("../database/connection");

async function optimizeServer() {
  console.log("🚀 Starting server optimization...\n");

  try {
    // Connect to database
    console.log("📦 Connecting to database...");
    await connectDB();
    console.log("✓ Database connected\n");

    // Create indexes
    console.log("📊 Creating database indexes...");
    await createIndexes();
    console.log("✓ Indexes created\n");

    console.log("🎉 Server optimization complete!");
    console.log("\n📝 Next steps:");
    console.log("1. Restart your server to apply all changes");
    console.log("2. Monitor performance using the /api/metrics endpoint");
    console.log("3. Check logs for any slow queries or high memory usage\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Optimization failed:", error);
    process.exit(1);
  }
}

// Run optimization
optimizeServer();
