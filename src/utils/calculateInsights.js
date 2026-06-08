// calculateInsights.js - Utility to calculate profile insights from GitHub data
// Separating this logic makes it easy to test and modify later

/**
 * Calculates how many days ago a GitHub account was created
 * @param {string} createdAt - ISO date string from GitHub API
 * @returns {number} - Number of days since account creation
 */
const calculateAccountAgeDays = (createdAt) => {
  const createdDate = new Date(createdAt);
  const today = new Date();

  // Difference in milliseconds, converted to days
  const diffMs = today - createdDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Calculates a score for a GitHub profile based on activity metrics
 *
 * Score Formula:
 * score = (followers * 2) + public_repos + (public_gists * 0.5)
 *
 * @param {number} followers
 * @param {number} public_repos
 * @param {number} public_gists
 * @returns {number} - Rounded score
 */
const calculateScore = (followers, public_repos, public_gists) => {
  const score = followers * 2 + public_repos + public_gists * 0.5;
  return Math.round(score);
};

/**
 * Extracts and computes all insights from raw GitHub API response
 * @param {object} githubData - Raw data from GitHub API
 * @returns {object} - Cleaned and computed profile insights
 */
const calculateInsights = (githubData) => {
  const {
    login,
    name,
    bio,
    followers,
    following,
    public_repos,
    public_gists,
    created_at,
    html_url,
    avatar_url,
  } = githubData;

  const account_age_days = calculateAccountAgeDays(created_at);
  const score = calculateScore(followers, public_repos, public_gists);

  return {
    github_username: login,
    name: name || null,
    bio: bio || null,
    followers,
    following,
    public_repos,
    public_gists,
    account_age_days,
    profile_url: html_url,
    avatar_url,
    score,
  };
};

module.exports = { calculateInsights };
