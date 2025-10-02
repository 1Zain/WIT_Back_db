const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// Get current user's profile - users can see their own data
router.get("/profile", authMiddleware(["admin", "user"]), async(req,res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({message: "User not found"});
        res.json(user);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Get all users - admin only
router.get("/", authMiddleware(["admin"]), async(req,res) => {
    try {
        const users = await User.findAll({order: [["id", "ASC"]] });
        res.json(users);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Get user by ID - users can only see their own data
router.get("/:id", authMiddleware(["admin", "user"]), async (req,res) => {
    try {
        // Users can only access their own data, admins can access any
        if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({message: "Access denied"});
        }
        
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        res.json(user);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Create new user - admin only
router.post("/",authMiddleware(["admin"]), async (req,res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Update user - users can only update their own data
router.put("/:id", authMiddleware(["admin", "user"]), async (req,res) => {
    try {
        // Users can only update their own data, admins can update any
        if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({message: "Access denied"});
        }
        
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        
        // Prevent users from changing their role (only admins can do this)
        if (req.user.role !== "admin" && req.body.role) {
            delete req.body.role;
        }
        
        // Prevent changing default admin's role or email
        if (user.email === "admin@wit.com") {
            delete req.body.role;
            delete req.body.email;
        }
        
        await user.update(req.body);
        res.json(user);
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Delete user - admin only (default admin cannot be deleted)
router.delete("/:id", authMiddleware(["admin"]),async (req,res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        
        // Prevent deletion of default admin (identified by email)
        if (user.email === "admin@wit.com") {
            return res.status(403).json({message: "Default admin cannot be deleted"});
        }
        
        await user.destroy();
        res.json({message: "User deleted"});
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = router;

