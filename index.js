const express = require("express");
const app = express();
const sequelize = require("./config/database");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);


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
