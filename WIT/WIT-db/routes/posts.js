const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

// Create new post - authenticated users only
router.post("/", authMiddleware(["admin", "user"]), upload.single("media"), async (req,res) => {
    try {
        const {title, content} = req.body;
        const mediaPath = req.file ? req.file.path : null;
        const userId = req.user.id; // Get userId from authenticated user
        const sharedAt = new Date(); // UTC timestamp when post is shared

        const post = await Post.create({title, content, userId, mediaPath, sharedAt});
        res.status(201).json(post);
    }catch(error) {
        res.status(500).json({error: error.message});
    }
});

// Get all posts - users can see everyone's posts
router.get("/", authMiddleware(["admin", "user"]), async (req,res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: require("../models/user"),
                attributes: ['id', 'name', 'email'] // Include user info but not password
            }],
            order: [['sharedAt', 'DESC']] // Show newest posts first by share time
        });
        res.json(posts);
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})

// Get specific post by ID - users can see any post
router.get("/:id", authMiddleware(["admin", "user"]), async (req,res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [{
                model: require("../models/user"),
                attributes: ['id', 'name', 'email']
            }]
        });
        if(!post) return res.status(404).json({message: "Post not found"});
        res.json(post);
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})

// Update post - users can only edit their own posts
router.put("/:id", authMiddleware(["admin", "user"]), upload.single("media"), async (req,res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});

        // Users can only edit their own posts, admins can edit any
        if (req.user.role !== "admin" && post.userId !== req.user.id) {
            return res.status(403).json({message: "Access denied"});
        }

        const {title, content} = req.body;
        const mediaPath = req.file ? req.file.path : post.mediaPath; // keep old if no new file 

        await post.update({title, content, mediaPath});
        res.json(post);
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})

// Delete post - users can only delete their own posts
router.delete("/:id", authMiddleware(["admin", "user"]), async (req,res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});

        // Users can only delete their own posts, admins can delete any
        if (req.user.role !== "admin" && post.userId !== req.user.id) {
            return res.status(403).json({message: "Access denied"});
        }

        await post.destroy();
        res.json({message:"Post deleted"});
    }catch(error) {
        res.status(500).json({error : error.message})
    }
})


module.exports = router;
