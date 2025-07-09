const express = require('express');
const {
    validateUserRegistration,
    validateUserLogin,
    validatePostCreation,
    validateMongoId,
    validatePagination
} = require('./middleware/validation');

const app = express();
app.use(express.json());

// Test user registration validation
app.post('/test/register', validateUserRegistration, (req, res) => {
    res.json({ success: true, message: 'Validation passed!', data: req.body });
});

// Test user login validation
app.post('/test/login', validateUserLogin, (req, res) => {
    res.json({ success: true, message: 'Login validation passed!', data: req.body });
});

// Test post creation validation
app.post('/test/post', validatePostCreation, (req, res) => {
    res.json({ success: true, message: 'Post validation passed!', data: req.body });
});

// Test MongoDB ID validation
app.get('/test/post/:id', validateMongoId('id'), (req, res) => {
    res.json({ success: true, message: 'ID validation passed!', id: req.params.id });
});

// Test pagination validation
app.get('/test/posts', validatePagination, (req, res) => {
    res.json({ success: true, message: 'Pagination validation passed!', query: req.query });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Validation test server running on port ${PORT}`);
    console.log('\nTest commands:');
    console.log('1. Valid registration:');
    console.log(`curl -X POST http://localhost:${PORT}/test/register -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"Test123"}'`);
    
    console.log('\n2. Invalid registration:');
    console.log(`curl -X POST http://localhost:${PORT}/test/register -H "Content-Type: application/json" -d '{"username":"ab","email":"invalid","password":"123"}'`);
    
    console.log('\n3. Valid login:');
    console.log(`curl -X POST http://localhost:${PORT}/test/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'`);
    
    console.log('\n4. Invalid login:');
    console.log(`curl -X POST http://localhost:${PORT}/test/login -H "Content-Type: application/json" -d '{"email":"invalid-email","password":""}'`);
    
    console.log('\n5. Valid post:');
    console.log(`curl -X POST http://localhost:${PORT}/test/post -H "Content-Type: application/json" -d '{"type":"text","title":"Test Post","content":"This is a test post"}'`);
    
    console.log('\n6. Invalid post:');
    console.log(`curl -X POST http://localhost:${PORT}/test/post -H "Content-Type: application/json" -d '{"type":"invalid","title":"","content":"${'x'.repeat(6000)}"}'`);
    
    console.log('\n7. Valid MongoDB ID:');
    console.log(`curl http://localhost:${PORT}/test/post/507f1f77bcf86cd799439011`);
    
    console.log('\n8. Invalid MongoDB ID:');
    console.log(`curl http://localhost:${PORT}/test/post/invalid-id`);
    
    console.log('\n9. Valid pagination:');
    console.log(`curl "http://localhost:${PORT}/test/posts?page=1&limit=10"`);
    
    console.log('\n10. Invalid pagination:');
    console.log(`curl "http://localhost:${PORT}/test/posts?page=abc&limit=200"`);
});
