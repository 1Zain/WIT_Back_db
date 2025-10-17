require("dotenv").config();
const {Sequelize} = require("sequelize");

// Database configuration for both development and production
const sequelize = new Sequelize(
    process.env.DB_NAME || process.env.DATABASE_URL,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log
});

module.exports = sequelize;