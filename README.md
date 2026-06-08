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

### Deploy on Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo
4. Set environment variables in Render dashboard
5. Set start command: `npm start`
6. Add a MySQL database (use PlanetScale or Railway for free MySQL)

### Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project → Deploy from GitHub repo
3. Add a MySQL plugin
4. Railway auto-injects DB environment variables
5. Add `PORT`, and the app will be live

---

---

# INTERVIEW NOTES

*Simple fresher-friendly explanations for common interview questions*

---

### 1. Why Node.js?

> "Sir, I used Node.js because it is JavaScript on the server side. Since JavaScript is already used on the frontend, using Node.js means I only need to learn one language for both frontend and backend. Also, Node.js is very fast because it is non-blocking and event-driven, which means it can handle many requests at the same time without waiting. It is also very popular for building APIs and REST services."

---

### 2. Why Express.js?

> "Express.js is a framework built on top of Node.js. Without Express, writing a server in plain Node.js requires a lot of boilerplate code. Express makes it very easy to define routes like GET, POST, PUT, and handle middleware. It's like a helper that simplifies web server development. It is also the most popular Node.js framework, so there are lots of tutorials and community support."

---

### 3. Why Sequelize?

> "Sequelize is an ORM — Object Relational Mapper. Instead of writing raw SQL queries like `INSERT INTO profiles VALUES (...)`, I can just write `Profile.create({...})` in JavaScript. This makes the code cleaner and more readable. It also handles things like table creation automatically and protects against SQL injection. It supports MySQL, PostgreSQL, and other databases, so if we switch databases later, we don't need to rewrite everything."

---

### 4. Why Axios?

> "Axios is a library used to make HTTP requests from Node.js. I used it to call the GitHub Public API to fetch user data. It is better than the built-in `fetch` because it automatically handles JSON parsing, has better error handling, and supports request/response interceptors. When GitHub returns a 404 error (user not found), Axios throws an error with the status code which I can catch and handle properly."

---

### 5. Why MySQL?

> "MySQL is a relational database that stores data in tables with rows and columns. I chose MySQL because the profile data has a fixed structure — every profile has the same fields like username, followers, score, etc. Relational databases are great when the data structure is predictable. MySQL is also free, widely used in the industry, and well-supported by Sequelize."

---

### 6. MVC Architecture

> "MVC stands for Model-View-Controller. It is a design pattern that separates the application into three parts:
> - **Model** — This is the data layer. In my project, `Profile.js` is the model. It defines the database table structure.
> - **View** — In a backend API, there's no visual view. The JSON response is the view.
> - **Controller** — This handles the business logic. `profileController.js` receives the request, talks to the service and model, and sends back the response.
> 
> I also have a **Service layer** (githubService.js) which handles external API calls, and a **Routes layer** (profileRoutes.js) that maps URLs to controllers. This keeps the code organized and each file has one clear responsibility."

---

### 7. API Flow

> "When a user sends a POST request to `/api/profiles/analyze` with a GitHub username:
> 1. The request hits `profileRoutes.js` which maps it to the `analyzeProfile` controller
> 2. The controller validates the username
> 3. It calls `githubService.js` which makes an Axios GET request to `https://api.github.com/users/{username}`
> 4. GitHub sends back the profile data
> 5. The controller passes this data to `calculateInsights.js` which computes the score and account age
> 6. The computed insights are saved to MySQL using the Sequelize `Profile.upsert()` method
> 7. The saved profile data is returned as a JSON response"

---

### 8. Database Design

> "I have one table called `profiles`. Each row represents one GitHub user. I used `github_username` as a unique field so that the same user can't be stored twice. The `id` is an auto-incremented primary key. `created_at` and `updated_at` are managed automatically by Sequelize — they track when the record was first created and last updated. The `score` is a calculated field based on the formula: followers × 2 + repos + gists × 0.5."

---

### 9. Error Handling

> "I used try-catch blocks in every controller function. If the username is missing, I return a 400 Bad Request error. If GitHub says the user doesn't exist (404), I catch that from the Axios error and return a meaningful message. If there's any database issue, I return a 500 Internal Server Error. All error responses follow the same format: `{ success: false, message: '...' }` so the frontend always knows what to expect. I also added console.error() to log errors on the server for debugging."

---

### 10. GitHub API Integration

> "I used the GitHub Public API endpoint `https://api.github.com/users/{username}`. This is a free, public API — no authentication required for basic use, but it has a rate limit of 60 requests per hour for unauthenticated requests. If you add a GitHub Personal Access Token, the limit increases to 5000 per hour. I kept the API call in a separate service file called `githubService.js` so that the controller doesn't directly deal with HTTP calls. This makes the code more modular and easier to maintain or test."

---

*Built as part of Node.js Internship Assignment*
