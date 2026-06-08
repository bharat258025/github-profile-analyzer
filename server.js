// server.js - Entry point of the application
// This file starts the Express server

const app = require("./src/app");
const { sequelize } = require("./src/config/database");

// Load environment variables
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Sync database and start server
// sequelize.sync() creates the table if it doesn't exist
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected and synced successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  });
