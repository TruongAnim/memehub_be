const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticateJWT } = require('./users');

// Lấy danh sách category
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Thêm category mới
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Sửa category
router.patch('/:id', authenticateJWT, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        if (req.body.name !== undefined) category.name = req.body.name;
        if (req.body.description !== undefined) category.description = req.body.description;
        await category.save();
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Xóa category
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        await category.deleteOne();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 