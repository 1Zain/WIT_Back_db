const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");


// Get all users

router.get("/",authMiddleware(["admin", "user"]), async(req,res) => {
    try {
        const users = await User.findAll({order: [["id", "ASC"]] });
        res.json(users);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Get by id

router.get("/:id",authMiddleware(["admin","user"]), async (req,res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        res.json(user);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.post("/",authMiddleware(["admin"]), async (req,res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.put("/:id",authMiddleware(["admin"]), async (req,res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        await user.update(req.body);
        res.json(user);
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.delete("/:id", authMiddleware(["admin"]),async (req,res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        await user.destroy();
        res.json({message: "User deleted"});
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = router;

