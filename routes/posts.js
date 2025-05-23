const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { authenticateJWT } = require('./users'); // dùng middleware auth đã có

// Tạo post mới
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { type, title, content, imageUrl, videoUrl, thumbnailUrl, videoWidth, videoHeight, categories, tags } = req.body;
        const post = new Post({
            type,
            title,
            content,
            imageUrl,
            videoUrl,
            thumbnailUrl,
            videoWidth,
            videoHeight,
            author: req.user.id,
            categories,
            tags
        });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Lấy danh sách post (có phân trang, filter)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, type, category, tag } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (category) filter.categories = category;
        if (tag) filter.tags = tag;
        const posts = await Post.find(filter)
            .populate('author', 'username')
            .populate('categories', 'name')
            .populate('tags', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy chi tiết 1 post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('categories', 'name')
            .populate('tags', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upvote/Downvote post
router.post('/:id/vote', authenticateJWT, async (req, res) => {
    try {
        const { value } = req.body; // 1: upvote, -1: downvote
        if (![1, -1].includes(value)) return res.status(400).json({ error: 'Invalid vote value' });
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        // Remove previous vote if exists
        post.votes = post.votes.filter(v => v.user.toString() !== req.user.id);
        // Add new vote
        post.votes.push({ user: req.user.id, value });
        await post.save();
        res.json({ success: true, votes: post.votes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm comment cho post
router.post('/:id/comment', authenticateJWT, async (req, res) => {
    try {
        const { content, parent } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        const comment = new Comment({
            post: post._id,
            author: req.user.id,
            content,
            parent: parent || null
        });
        await comment.save();
        post.comments.push(comment._id);
        await post.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Sửa post
router.patch('/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
        const fields = ['type', 'title', 'content', 'imageUrl', 'videoUrl', 'thumbnailUrl', 'videoWidth', 'videoHeight', 'categories', 'tags'];
        fields.forEach(field => {
            if (req.body[field] !== undefined) post[field] = req.body[field];
        });
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Xóa post
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
        await post.deleteOne();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 