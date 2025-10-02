const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/database");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const path = require("path");
const fs = require("fs");
const User = require("./models/user");

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use(express.json());
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);


// Function to reset database (uncomment the line below to enable)
const RESET_DATABASE = true;

// Function to create uploads directory
function createUploadsFolder() {
  const uploadsDir = path.join(__dirname, "uploads");
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📁 Uploads folder created successfully!");
  } else {
    console.log("📁 Uploads folder already exists");
  }
}

// Function to create default admin
async function createDefaultAdmin() {
  try {
    // Check if default admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: "admin@wit.com" } 
    });
    
    if (existingAdmin) {
      console.log("✅ Default admin already exists:", existingAdmin.email);
      return;
    }

    // Create default admin
    const defaultAdmin = await User.create({
      name: "Default Admin",
      email: "admin@wit.com",
      password: "admin123", // This will be hashed by the beforeCreate hook
      role: "admin"
    });

    console.log("✅ Default admin created successfully!");
    console.log("📧 Email: admin@wit.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");
    
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
  }
}

sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
    
    // Reset database if enabled (uncomment RESET_DATABASE = true above)
    if (typeof RESET_DATABASE !== 'undefined' && RESET_DATABASE) {
      console.log("🔄 Resetting database...");
      return sequelize.sync({ force: true }); // This will drop and recreate all tables
    } else {
      return sequelize.sync();
    }
  })
  .then(async () => {
    // Create uploads folder
    createUploadsFolder();
    
    // Create default admin after database sync
    await createDefaultAdmin();
    
    app.listen(3000, () => {
        console.log("🚀 Server is running on port 3000");
    });
  })
  .catch(err => console.log("Error: " + err));
