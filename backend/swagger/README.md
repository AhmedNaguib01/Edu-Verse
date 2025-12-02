# EduVerse API Documentation

This folder contains the Swagger/OpenAPI documentation for the EduVerse backend API.

## Structure

- `config.js` - Main Swagger configuration with schemas and security definitions
- `auth.yaml` - Authentication endpoints (register, login)
- `users.yaml` - User management endpoints
- `courses.yaml` - Course management endpoints
- `posts.yaml` - Post management endpoints
- `comments.yaml` - Comment endpoints
- `reactions.yaml` - Reaction endpoints
- `files.yaml` - File upload/download endpoints
- `chats.yaml` - Chat management endpoints
- `messages.yaml` - Message endpoints

## Accessing the Documentation

Once the server is running, you can access the interactive Swagger UI at:

```
http://localhost:8000/api-docs
```

## Authentication

Most endpoints require JWT authentication. To use authenticated endpoints:

1. Register or login to get a JWT token
2. Click the "Authorize" button in Swagger UI
3. Enter your token in the format: `Bearer <your-token>`
4. Click "Authorize" to apply the token to all requests

## API Base URL

All API endpoints are prefixed with `/api`:

```
http://localhost:8000/api
```

## Available Tags

- **Authentication** - User registration and login
- **Users** - User profile management and search
- **Courses** - Course CRUD operations and enrollment
- **Posts** - Post creation and management
- **Comments** - Comment on posts
- **Reactions** - React to posts (like, love, etc.)
- **Files** - File upload and download
- **Chats** - Chat management
- **Messages** - Send and receive messages

## Response Formats

All responses are in JSON format. Error responses follow this structure:

```json
{
  "error": "Error message description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
