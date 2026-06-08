# GitHub Profile Analyzer API

A backend REST API built with Node.js and Express.js that fetches GitHub user profiles using the GitHub Public API, calculates useful insights, and stores them in a MySQL database.

---

## Project Overview

This project lets you analyze any GitHub user by just passing their username. It fetches their profile details from GitHub, calculates a score based on their activity, and saves everything in a MySQL database. You can then retrieve, search, and compare profiles.

---

## Features

- Analyze any GitHub user profile via username
- Auto-calculates profile score based on followers, repos, and gists
- Saves/updates profile data in MySQL
- Get all stored profiles
- Search profiles by username or name
- View top profiles ranked by score
- Reanalyze profiles to get fresh data from GitHub
- Full error handling for missing users, validation, and DB errors

---

## Folder Structure

```
github-profile-analyzer/
│
├── src/
│   ├── controllers/
│   │   └── profileController.js    # Handles request/response logic
│   │
│   ├── services/
│   │   └── githubService.js        # GitHub API calls using Axios
│   │
│   ├── models/
│   │   └── Profile.js              # Sequelize model (maps to MySQL table)
│   │
│   ├── routes/
│   │   └── profileRoutes.js        # Route definitions
│   │
│   ├── config/
│   │   └── database.js             # Sequelize/MySQL connection setup
│   │
│   ├── utils/
│   │   └── calculateInsights.js    # Score calculation utility
│   │
│   └── app.js                      # Express app configuration
│
├── server.js                       # Entry point - starts the server
├── .env.example                    # Environment variable template
├── schema.sql                      # Manual SQL schema (optional)
├── postman_collection.json         # Postman API collection
├── package.json
└── README.md
```

---

## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/your-username/github-profile-analyzer.git
cd github-profile-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Now open `.env` and fill in your MySQL credentials (see below).

### 4. Create MySQL database

```sql
CREATE DATABASE github_analyzer;
```

Or run the provided schema file:

```bash
mysql -u root -p < schema.sql
```

### 5. Start the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=github_analyzer

# Optional: Increases GitHub API rate limit from 60 to 5000 req/hour
# GITHUB_TOKEN=your_token_here
```

---

## Database Setup

Sequelize will **automatically create the `profiles` table** when the server starts (using `sequelize.sync()`). No manual SQL needed.

However, if you prefer to create it manually:

```sql
CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

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
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
```

---

## Run Commands

| Command | Description |
|---|---|
| `npm start` | Start server (production) |
| `npm run dev` | Start server with nodemon (development) |

---

## API Documentation

### Base URL

```
http://localhost:5000
```

---

### 1. Health Check

**GET** `/health`

```json
Response:
{
  "success": true
}
```

---

### 2. Analyze Profile

**POST** `/api/profiles/analyze`

Fetches GitHub data, calculates insights, and saves to DB.

```json
Request Body:
{
  "username": "octocat"
}
```

---

### 3. Get All Profiles

**GET** `/api/profiles`

Returns all stored profiles.

---

### 4. Search Profiles

**GET** `/api/profiles?search=octo`

Returns profiles matching the search term in username or name.

---

### 5. Get Single Profile

**GET** `/api/profiles/:username`

Returns one profile by GitHub username.

---

### 6. Reanalyze Profile

**PUT** `/api/profiles/:username/reanalyze`

Re-fetches from GitHub and updates the existing record.

---

### 7. Top Profiles

**GET** `/api/profiles/top`

Returns top 10 profiles sorted by score (descending).

Optional: `?limit=5` to change the number of results.

---

## Sample Requests

### Analyze a profile

```bash
curl -X POST http://localhost:5000/api/profiles/analyze \
  -H "Content-Type: application/json" \
  -d '{"username": "octocat"}'
```

### Get all profiles

```bash
curl http://localhost:5000/api/profiles
```

### Search profiles

```bash
curl http://localhost:5000/api/profiles?search=octo
```

### Get top profiles

```bash
curl http://localhost:5000/api/profiles/top
```

---

## Sample Responses

### Successful Analyze Response

```json
{
  "success": true,
  "message": "Profile analyzed and saved",
  "data": {
    "id": 1,
    "github_username": "octocat",
    "name": "The Octocat",
    "bio": null,
    "followers": 14985,
    "following": 9,
    "public_repos": 8,
    "public_gists": 8,
    "account_age_days": 5432,
    "profile_url": "https://github.com/octocat",
    "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
    "score": 30978,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error: Username missing

```json
{
  "success": false,
  "message": "Username is required"
}
```

### Error: GitHub user not found

```json
{
  "success": false,
  "message": "GitHub user not found"
}
```

---

## Score Formula

```
score = (followers × 2) + public_repos + (public_gists × 0.5)
```

Result is rounded to the nearest integer.

---

## Deployment Guide

### Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project → Deploy from GitHub repo
3. Add a MySQL plugin
4. Railway auto-injects DB environment variables
5. Add `PORT`, and the app will be live

---
