const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const { authenticateJWT } = require('./users');

// Lấy danh sách tag
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm tag mới
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { name } = req.body;
        const tag = new Tag({ name });
        await tag.save();
        res.status(201).json(tag);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Sửa tag
router.patch('/:id', authenticateJWT, async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        if (req.body.name !== undefined) tag.name = req.body.name;
        await tag.save();
        res.json(tag);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Xóa tag
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        await tag.deleteOne();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 