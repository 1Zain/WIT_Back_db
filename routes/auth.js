const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

        const token = jwt.sign({id: user.id, role: user.role}, "fewhoufewuofebwo32b4ion32pndspjwe0rfhnw4io5n4oinfsdpibfwoib4o3b5gwgwrt3454324nb5jbsdj",
    {expiresIn: "1h"});

    res.json({message: "Login successful", token});
    }catch(err) {
        res.status(500).json({error: err.message});
    }
})

module.exports = router;
