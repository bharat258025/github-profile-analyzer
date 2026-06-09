const app = require("./src/app");
const { sequelize } = require("./src/config/database");
require("dotenv").config();

// Railway provides its own PORT - we must use it
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected and synced successfully");
    app.listen(PORT, "0.0.0.0", () => {  // "0.0.0.0" is important for Railway
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  });