require("dotenv").config();
const {Sequelize} = require("sequelize");

// crud_api = database name,
// postgres = user, 
// 1234 = password
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
    host: process.env.DB_HOST,
    dialect: "postgres",
});

module.exports = sequelize;