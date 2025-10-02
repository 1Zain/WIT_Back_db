const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { types } = require("pg");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role : {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
    },

})

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;