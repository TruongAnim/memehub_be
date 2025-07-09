require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/database');
const cors = require('cors');

// Connect to database
connectDB();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var commentsRouter = require('./routes/comments');
var categoriesRouter = require('./routes/categories');
var tagsRouter = require('./routes/tags');

var app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
    exposedHeaders: ['Content-Range']
}));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Handle validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            error: `${field} already exists`
        });
    }

    // Handle cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

module.exports = app;
