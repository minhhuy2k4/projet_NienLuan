// Load environment variables from file .env
require("dotenv").config();

const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const { createIndexes } = require("./app/utils/create-indexes");

// Start server
async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the database!");

    // Tạo indexes (chỉ tạo nếu chưa có)
    console.log("\n🔍 Checking and creating indexes...");
    await createIndexes();
    console.log("✅ Indexes ready!\n");

    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit(1);
  }
}

startServer();
