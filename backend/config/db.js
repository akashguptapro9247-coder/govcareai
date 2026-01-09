// Database configuration
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Create a sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'govcareai',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Don't exit the process, just log the error
    // This allows the server to start even if database connection fails
    console.log('Server started but database connection failed. Please check your database configuration.');
  }
};

module.exports = { sequelize, connectDB };