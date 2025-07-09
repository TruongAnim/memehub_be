const { body, param, query, validationResult } = require('express-validator');

// Middleware để xử lý validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

// User validation schemas
const validateUserRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    handleValidationErrors
];

const validateUserLogin = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

const validateProfileUpdate = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Bio cannot be more than 200 characters'),
    
    body('avatar')
        .optional()
        .trim()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
    
    handleValidationErrors
];

const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6, max: 100 })
        .withMessage('New password must be between 6 and 100 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    handleValidationErrors
];

// Post validation schemas
const validatePostCreation = [
    body('type')
        .isIn(['text', 'image', 'video'])
        .withMessage('Post type must be text, image, or video'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    
    body('content')
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Content cannot be more than 5000 characters'),
    
    body('imageUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    
    body('videoUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('Video URL must be a valid URL'),
    
    body('thumbnailUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('Thumbnail URL must be a valid URL'),
    
    body('videoWidth')
        .optional()
        .isInt({ min: 1, max: 4000 })
        .withMessage('Video width must be between 1 and 4000 pixels'),
    
    body('videoHeight')
        .optional()
        .isInt({ min: 1, max: 4000 })
        .withMessage('Video height must be between 1 and 4000 pixels'),
    
    body('categories')
        .optional()
        .isArray()
        .withMessage('Categories must be an array'),
    
    body('categories.*')
        .optional()
        .isMongoId()
        .withMessage('Each category must be a valid MongoDB ObjectId'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    
    body('tags.*')
        .optional()
        .isMongoId()
        .withMessage('Each tag must be a valid MongoDB ObjectId'),
    
    handleValidationErrors
];

const validatePostUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    
    body('content')
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Content cannot be more than 5000 characters'),
    
    body('categories')
        .optional()
        .isArray()
        .withMessage('Categories must be an array'),
    
    body('categories.*')
        .optional()
        .isMongoId()
        .withMessage('Each category must be a valid MongoDB ObjectId'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    
    body('tags.*')
        .optional()
        .isMongoId()
        .withMessage('Each tag must be a valid MongoDB ObjectId'),
    
    handleValidationErrors
];

// Comment validation schemas
const validateCommentCreation = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment content must be between 1 and 1000 characters'),
    
    body('parent')
        .optional()
        .isMongoId()
        .withMessage('Parent comment must be a valid MongoDB ObjectId'),
    
    handleValidationErrors
];

// Category validation schemas
const validateCategoryCreation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category name must be between 1 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-_]+$/)
        .withMessage('Category name can only contain letters, numbers, spaces, hyphens, and underscores'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description cannot be more than 200 characters'),
    
    handleValidationErrors
];

// Tag validation schemas
const validateTagCreation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Tag name must be between 1 and 30 characters')
        .matches(/^[a-zA-Z0-9\s\-_]+$/)
        .withMessage('Tag name can only contain letters, numbers, spaces, hyphens, and underscores'),

    body('slug')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Tag slug must be between 1 and 30 characters')
        .matches(/^[a-zA-Z0-9\-_]+$/)
        .withMessage('Tag slug can only contain letters, numbers, hyphens, and underscores'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description cannot be more than 200 characters'),

    handleValidationErrors
];

// Vote validation schemas
const validateVote = [
    body('value')
        .isIn([1, -1])
        .withMessage('Vote value must be 1 (upvote) or -1 (downvote)'),
    
    handleValidationErrors
];

// Common parameter validations
const validateMongoId = (paramName) => [
    param(paramName)
        .isMongoId()
        .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
    
    handleValidationErrors
];

// Query parameter validations
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('_page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('_limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate,
    validatePasswordChange,
    validatePostCreation,
    validatePostUpdate,
    validateCommentCreation,
    validateCategoryCreation,
    validateTagCreation,
    validateVote,
    validateMongoId,
    validatePagination
};
