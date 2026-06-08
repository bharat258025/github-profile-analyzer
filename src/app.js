// app.js - Express app setup
// This file configures middleware and routes

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Health check route - simple endpoint to verify server is running
app.get("/health", (req, res) => {
  res.json({ success: true });
});

// All profile-related routes
app.use("/api/profiles", profileRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
