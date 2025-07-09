# Input Validation Middleware

Hệ thống validation middleware sử dụng `express-validator` để đảm bảo tính toàn vẹn dữ liệu đầu vào.

## Tính năng

### ✅ User Validation
- **Registration**: Username (3-30 ký tự, chỉ chữ/số/_), email hợp lệ, password mạnh
- **Login**: Email và password validation
- **Profile Update**: Validation cho username, email, bio, avatar URL
- **Password Change**: Validation password hiện tại và mới

### ✅ Post Validation
- **Creation**: Type (text/image/video), title, content, URLs, dimensions
- **Update**: Validation cho các trường có thể cập nhật
- **Media**: URL validation cho image, video, thumbnail

### ✅ Comment Validation
- **Content**: 1-1000 ký tự
- **Parent**: MongoDB ObjectId validation cho nested comments

### ✅ Category & Tag Validation
- **Category**: Name (1-50 ký tự), description optional
- **Tag**: Name, slug, description với format validation

### ✅ Common Validations
- **MongoDB ObjectId**: Validation cho tất cả ID parameters
- **Pagination**: Page và limit validation
- **Vote**: Upvote (1) hoặc downvote (-1)

## Cách sử dụng

### Import validation functions:
```javascript
const {
    validateUserRegistration,
    validatePostCreation,
    validateMongoId,
    validatePagination
} = require('../middleware/validation');
```

### Áp dụng vào routes:
```javascript
// Single validation
router.post('/register', validateUserRegistration, async (req, res) => {
    // Handler code
});

// Multiple validations
router.post('/:id/vote', 
    authenticateJWT, 
    validateMongoId('id'), 
    validateVote, 
    async (req, res) => {
    // Handler code
});
```

## Error Response Format

### Validation Error:
```json
{
    "success": false,
    "error": "Validation failed",
    "details": [
        {
            "field": "username",
            "message": "Username must be between 3 and 30 characters",
            "value": "ab"
        }
    ]
}
```

### MongoDB Errors:
```json
{
    "success": false,
    "error": "email already exists"
}
```

## Validation Rules

### Password Requirements:
- Minimum 6 characters
- At least 1 lowercase letter
- At least 1 uppercase letter  
- At least 1 number

### Username Rules:
- 3-30 characters
- Only letters, numbers, underscores
- Unique

### Content Limits:
- Post title: 1-200 characters
- Post content: max 5000 characters
- Comment: 1-1000 characters
- Bio: max 200 characters

### Media Validation:
- URLs must be valid format
- Video dimensions: 1-4000 pixels
- Image/video/thumbnail URLs validated

## Middleware Chain Order

Đúng thứ tự middleware:
1. Authentication (`authenticateJWT`)
2. Authorization (`requireAdmin`)
3. Parameter validation (`validateMongoId`)
4. Body validation (`validateUserRegistration`, etc.)
5. Route handler

## Customization

Để thêm validation mới:

1. Tạo validation schema trong `middleware/validation.js`
2. Export function
3. Import và sử dụng trong routes
4. Test với các trường hợp edge cases

## Testing

Validation có thể test bằng cách gửi invalid data:

```bash
# Invalid email
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"invalid","password":"Test123"}'

# Short password  
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123"}'
```

## Performance

- Validation chạy trước database operations
- Giảm thiểu invalid requests đến database
- Error responses nhanh cho client
- Memory efficient với express-validator
