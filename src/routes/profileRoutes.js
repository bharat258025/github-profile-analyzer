// profileRoutes.js - Route definitions
// Routes connect HTTP endpoints to controller functions
// This is like a map: URL + HTTP method → which function to call

const express = require("express");
const router = express.Router();

const {
  analyzeProfile,
  getAllProfiles,
  getProfileByUsername,
  reanalyzeProfile,
  getTopProfiles,
} = require("../controllers/profileController");

// IMPORTANT: The /top route must be defined BEFORE /:username
// Otherwise Express would treat "top" as a username param
router.get("/top", getTopProfiles);

// POST /api/profiles/analyze - Analyze and save a GitHub profile
router.post("/analyze", analyzeProfile);

// GET /api/profiles - Get all profiles (supports ?search=query)
router.get("/", getAllProfiles);

// GET /api/profiles/:username - Get a single profile by username
router.get("/:username", getProfileByUsername);

// PUT /api/profiles/:username/reanalyze - Reanalyze an existing profile
router.put("/:username/reanalyze", reanalyzeProfile);

module.exports = router;
