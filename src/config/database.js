// database.js - Database configuration using Sequelize
// Sequelize is an ORM (Object Relational Mapper) for Node.js
// It lets us interact with MySQL using JavaScript objects instead of raw SQL

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a new Sequelize instance with MySQL connection details
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name
  process.env.DB_USER,      // MySQL username
  process.env.DB_PASSWORD,  // MySQL password
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",       // We are using MySQL
    logging: false,         // Set to console.log to see SQL queries in terminal
  }
);

module.exports = { sequelize };
