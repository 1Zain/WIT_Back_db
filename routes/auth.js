const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require("../middleware/auth");

router.post("/register", authMiddleware(["admin"]), async (req, res) => {
    try {
        const {name, email,password, role} = req.body;
        const existingUser = await User.findOne({where: {email}});
        if (existingUser) return res.status(400).json({message: "Email already exist"});

        const user = await User.create({name,email,password,role});
        res.status(201).json({message: "Done", user});
    }catch(err) {
        res.status(500).json({error: err.message});
    }
})

router.post("/login", async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({where: {email} });
        if(!user) return res.status(404).json({message: "User not found"});

        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.status(401).json({message : "Wrong Password"});

        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET,
    {expiresIn: "1h"});

    res.json({message: "Login successful", token});
    }catch(err) {
        res.status(500).json({error: err.message});
    }
})

module.exports = router;
