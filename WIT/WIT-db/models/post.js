const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");


const Post = sequelize.define("Post",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mediaPath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
        },
        sharedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
)


// Relations
User.hasMany(Post, {foreignKey: "userId", onDelete: "CASCADE"});
Post.belongsTo(User, {foreignKey: "userId"});

module.exports = Post;