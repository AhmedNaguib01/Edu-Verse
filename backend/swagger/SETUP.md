# Swagger API Documentation Setup

## Installation Complete ✅

The Swagger documentation has been successfully set up for the EduVerse backend API.

## What Was Added

### 1. Dependencies

- `swagger-jsdoc` - Generates Swagger specification from YAML files
- `swagger-ui-express` - Serves interactive Swagger UI

### 2. Documentation Files

All documentation files are located in `src/swagger/`:

```
src/swagger/
├── config.js          # Main Swagger configuration
├── auth.yaml          # Authentication endpoints
├── users.yaml         # User management
├── courses.yaml       # Course management
├── posts.yaml         # Post management
├── comments.yaml      # Comments
├── reactions.yaml     # Reactions
├── files.yaml         # File operations
├── chats.yaml         # Chat management
├── messages.yaml      # Messages
├── README.md          # Documentation guide
└── SETUP.md           # This file
```

### 3. Server Integration

The Swagger UI has been integrated into `server.js` and is accessible at:

```
http://localhost:8000/api-docs
```

## How to Use

### 1. Start the Server

```bash
cd KProject/backend
npm start
```

### 2. Access Swagger UI

Open your browser and navigate to:

```
http://localhost:8000/api-docs
```

### 3. Test Endpoints

1. **Without Authentication:**

   - Try the `/auth/register` or `/auth/login` endpoints first
   - These don't require authentication

2. **With Authentication:**
   - After logging in, copy the JWT token from the response
   - Click the "Authorize" button (🔒) at the top right
   - Enter: `Bearer <your-token>`
   - Click "Authorize"
   - Now you can test all protected endpoints

## API Documentation Structure

### Schemas

All data models are defined in `config.js`:

- User
- Course
- Post
- Comment
- Reaction
- File
- Chat
- Message

### Endpoints by Category

1. **Authentication** (`/api/auth`)

   - POST `/register` - Create new account
   - POST `/login` - Login to existing account

2. **Users** (`/api/users`)

   - GET `/search` - Search users
   - GET `/{id}` - Get user profile
   - PUT `/{id}` - Update user profile

3. **Courses** (`/api/courses`)

   - GET `/` - List all courses
   - POST `/` - Create course (instructor)
   - GET `/{id}` - Get course details
   - DELETE `/{id}` - Delete course (instructor)
   - POST `/{id}/enroll` - Enroll in course
   - POST `/{id}/unenroll` - Unenroll from course
   - GET `/enrolled/{userId}` - Get enrolled courses

4. **Posts** (`/api/posts`)

   - GET `/` - List posts (optionally filter by course)
   - POST `/` - Create post
   - GET `/{id}` - Get post with comments and reactions
   - DELETE `/{id}` - Delete post

5. **Comments** (`/api/comments`)

   - GET `/` - Get comments for a post
   - POST `/` - Add comment

6. **Reactions** (`/api/reactions`)

   - GET `/` - Get reactions for a post
   - POST `/` - Add/update reaction
   - DELETE `/{postId}` - Remove reaction

7. **Files** (`/api/files`)

   - POST `/` - Upload file
   - GET `/{id}` - Download file
   - DELETE `/{id}` - Delete file
   - GET `/course/{courseId}` - Get course files

8. **Chats** (`/api/chats`)

   - GET `/{userId}` - Get user's chats
   - POST `/` - Create/get chat

9. **Messages** (`/api/messages`)
   - GET `/{chatId}` - Get chat messages
   - POST `/` - Send message

## Features

### Interactive Testing

- Try out API endpoints directly from the browser
- See request/response examples
- View response schemas

### Authentication

- JWT Bearer token authentication
- Secure endpoint testing

### Comprehensive Documentation

- All endpoints documented
- Request/response schemas
- Example values
- Error responses

## Customization

To modify the documentation:

1. **Update Schemas**: Edit `src/swagger/config.js`
2. **Update Endpoints**: Edit the respective YAML files
3. **Changes are reflected immediately** after server restart

## Troubleshooting

### Swagger UI not loading

- Ensure server is running on port 8000
- Check console for errors
- Verify all YAML files are valid

### Authentication not working

- Make sure to include "Bearer " prefix before token
- Token must be valid and not expired
- Check token format in response

### Endpoints not showing

- Verify YAML syntax is correct
- Check that files are in `src/swagger/` directory
- Restart the server

## Next Steps

1. Test all endpoints using Swagger UI
2. Share the API documentation URL with your team
3. Update documentation as you add new features
4. Consider adding more examples and descriptions

## Support

For issues or questions about the API documentation, refer to:

- `README.md` in this directory
- Swagger official documentation: https://swagger.io/docs/
