// Profile.js - Sequelize Model for the profiles table
// A model defines the structure of the database table

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Define the Profile model - this maps to the 'profiles' table in MySQL
const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    github_username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Each GitHub username should appear only once
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, // Some GitHub users don't set their name
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    following: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    public_repos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    public_gists: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    account_age_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    profile_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: "profiles",   // Explicit table name in MySQL
    timestamps: true,        // Sequelize auto-manages created_at and updated_at
    underscored: true,       // Use snake_case for column names
  }
);

module.exports = Profile;
