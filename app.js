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

var app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

module.exports = app;
