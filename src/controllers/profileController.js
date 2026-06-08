// profileController.js - Controller layer
// Controllers handle incoming requests, call services, and send back responses
// This is the "C" in MVC (Model-View-Controller)

const Profile = require("../models/Profile");
const { fetchGitHubProfile } = require("../services/githubService");
const { calculateInsights } = require("../utils/calculateInsights");
const { Op } = require("sequelize");

// -------------------------------------------------------
// POST /api/profiles/analyze
// Analyzes a GitHub profile and saves it to the database
// -------------------------------------------------------
const analyzeProfile = async (req, res) => {
  try {
    const { username } = req.body;

    // Validate that username is provided
    if (!username || username.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    // Step 1: Fetch profile data from GitHub API
    const githubData = await fetchGitHubProfile(username.trim());

    // Step 2: Calculate insights from the raw GitHub data
    const insights = calculateInsights(githubData);

    // Step 3: Save or update profile in MySQL database
    // upsert = update if exists, insert if not
    const [profile, created] = await Profile.upsert(insights, {
      returning: true,
    });

    // Fetch the saved record to return it
    const savedProfile = await Profile.findOne({
      where: { github_username: insights.github_username },
    });

    return res.status(201).json({
      success: true,
      message: created ? "Profile analyzed and saved" : "Profile updated",
      data: savedProfile,
    });
  } catch (error) {
    // Handle GitHub user not found
    if (error.message === "GitHub user not found") {
      return res.status(404).json({
        success: false,
        message: "GitHub user not found",
      });
    }

    // Handle other errors
    console.error("Error in analyzeProfile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

// -------------------------------------------------------
// GET /api/profiles
// Returns all stored profiles, with optional search
// -------------------------------------------------------
const getAllProfiles = async (req, res) => {
  try {
    const { search } = req.query;

    // Build query conditions
    let whereCondition = {};

    // If search query is provided, search by username or name
    if (search) {
      whereCondition = {
        [Op.or]: [
          { github_username: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const profiles = await Profile.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]], // Show newest profiles first
    });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error("Error in getAllProfiles:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

// -------------------------------------------------------
// GET /api/profiles/:username
// Returns a single profile by GitHub username
// -------------------------------------------------------
const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const profile = await Profile.findOne({
      where: { github_username: username },
    });

    // If profile not found in our database
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Profile for '${username}' not found. Try analyzing it first.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error in getProfileByUsername:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

// -------------------------------------------------------
// PUT /api/profiles/:username/reanalyze
// Re-fetches data from GitHub and updates the database
// -------------------------------------------------------
const reanalyzeProfile = async (req, res) => {
  try {
    const { username } = req.params;

    // Check if profile exists in our database
    const existingProfile = await Profile.findOne({
      where: { github_username: username },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: `Profile for '${username}' not found. Try analyzing it first.`,
      });
    }

    // Fetch fresh data from GitHub
    const githubData = await fetchGitHubProfile(username);

    // Recalculate insights with fresh data
    const insights = calculateInsights(githubData);

    // Update the existing record in database
    await existingProfile.update(insights);

    // Fetch updated record
    const updatedProfile = await Profile.findOne({
      where: { github_username: username },
    });

    return res.status(200).json({
      success: true,
      message: "Profile reanalyzed and updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    if (error.message === "GitHub user not found") {
      return res.status(404).json({
        success: false,
        message: "GitHub user not found",
      });
    }

    console.error("Error in reanalyzeProfile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

// -------------------------------------------------------
// GET /api/profiles/top
// Returns top profiles sorted by score (highest first)
// -------------------------------------------------------
const getTopProfiles = async (req, res) => {
  try {
    // Optional: limit query param (default 10)
    const limit = parseInt(req.query.limit) || 10;

    const profiles = await Profile.findAll({
      order: [["score", "DESC"]], // Sort by score descending
      limit: limit,
    });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error("Error in getTopProfiles:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

module.exports = {
  analyzeProfile,
  getAllProfiles,
  getProfileByUsername,
  reanalyzeProfile,
  getTopProfiles,
};
