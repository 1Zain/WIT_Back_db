const {Sequelize} = require("sequelize");

// crud_api = database name,
//  postgres = user, 
// 1234 = password
const sequelize = new Sequelize("crud_api", "postgres", "1234", {
    host: "localhost",
    dialect: "postgres",
});

module.exports = sequelize;