const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const upload = require("../middleware/upload");



router.post("/", upload.single("media"), async (req,res) => {
    try {
        const {title, content, userId} = req.body;
        const mediaPath = req.file ? req.file.path : null;

        const post = await Post.create({title,content, userId, mediaPath});
        res.status(201).json(post);
    }catch(error) {
        res.status(500).json({error: error.message});
    }
});

router.get("/", async (req,res) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})


router.get("/:id", async (req,res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});
        res.json(post);
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})


router.put("/:id",upload.single("media") ,async (req,res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});

        const {title, content, userId} =req.body;
        const mediaPath = req.file ? req.file.path : post.mediaPath; // keep old if no new file 

        await post.update({title, content, userId, mediaPath});
        res.json(post);
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})



router.delete("/:id", async (req,res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});

        await post.destroy();
        res.json({message:"Post deleted"});
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})


module.exports = router;
