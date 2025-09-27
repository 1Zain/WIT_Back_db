const express = require("express");
const app = express();
const sequelize = require("./config/database");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use(express.json());
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);


sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(3000, () => {
        console.log("Server is run");
    });
  })
  .catch(err => console.log("Error: " + err));
