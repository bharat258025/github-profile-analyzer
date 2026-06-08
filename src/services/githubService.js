// githubService.js - Service layer to interact with GitHub Public API
// Keeping API calls in a separate service makes the code cleaner and reusable

const axios = require("axios");

// GitHub public API base URL
const GITHUB_API_BASE = "https://api.github.com";

/**
 * Fetches a GitHub user's profile data using their username
 * @param {string} username - GitHub username
 * @returns {object} - GitHub user data
 */
const fetchGitHubProfile = async (username) => {
  try {
    // Make GET request to GitHub API
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`, {
      headers: {
        // GitHub recommends setting Accept header
        Accept: "application/vnd.github.v3+json",
        // If you have a GitHub token, add it here to avoid rate limiting:
        // Authorization: `token ${process.env.GITHUB_TOKEN}`
      },
    });

    // Return the user data from GitHub response
    return response.data;
  } catch (error) {
    // If GitHub returns 404, the user was not found
    if (error.response && error.response.status === 404) {
      throw new Error("GitHub user not found");
    }

    // For other errors (network issues, rate limits, etc.)
    throw new Error("Failed to fetch GitHub profile: " + error.message);
  }
};

module.exports = { fetchGitHubProfile };
