-- SQL Schema for GitHub Profile Analyzer
-- Run this to manually create the database and table
-- Note: Sequelize will auto-create the table when server starts,
--       but this file is useful for reference and manual setup.

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS github_analyzer;

-- Step 2: Use the database
USE github_analyzer;

-- Step 3: Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  github_username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  bio TEXT,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  public_repos INT DEFAULT 0,
  public_gists INT DEFAULT 0,
  account_age_days INT DEFAULT 0,
  profile_url VARCHAR(500),
  avatar_url VARCHAR(500),
  score FLOAT DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: View all profiles sorted by score
-- SELECT * FROM profiles ORDER BY score DESC;
