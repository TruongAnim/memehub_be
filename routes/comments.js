const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { authenticateJWT } = require('./users');

// Upvote/Downvote comment
router.post('/:id/vote', authenticateJWT, async (req, res) => {
    try {
        const { value } = req.body; // 1: upvote, -1: downvote
        if (![1, -1].includes(value)) return res.status(400).json({ error: 'Invalid vote value' });
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        comment.votes = comment.votes.filter(v => v.user.toString() !== req.user.id);
        comment.votes.push({ user: req.user.id, value });
        await comment.save();
        res.json({ success: true, votes: comment.votes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Trả lời comment
router.post('/:id/reply', authenticateJWT, async (req, res) => {
    try {
        const { content } = req.body;
        const parentComment = await Comment.findById(req.params.id);
        if (!parentComment) return res.status(404).json({ error: 'Parent comment not found' });
        const comment = new Comment({
            post: parentComment.post,
            author: req.user.id,
            content,
            parent: parentComment._id
        });
        await comment.save();
        // Thêm vào danh sách comment của post
        await Post.findByIdAndUpdate(parentComment.post, { $push: { comments: comment._id } });
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Sửa comment
router.patch('/:id', authenticateJWT, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        if (comment.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
        if (req.body.content !== undefined) comment.content = req.body.content;
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Xóa comment
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        if (comment.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
        await comment.deleteOne();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 