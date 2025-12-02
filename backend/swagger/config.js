const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduVerse API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for the EduVerse educational platform",
      contact: {
        name: "EduVerse Team",
        email: "support@eduverse.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: {
              type: "string",
              enum: ["student", "instructor"],
              example: "student",
            },
            level: { type: "number", example: 3 },
            profilePicture: {
              type: "string",
              example: "507f1f77bcf86cd799439012",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Course: {
          type: "object",
          properties: {
            _id: { type: "string", example: "CS101" },
            name: { type: "string", example: "Introduction to Programming" },
            description: {
              type: "string",
              example: "Learn programming fundamentals",
            },
            creditHours: { type: "number", example: 3 },
            capacity: { type: "number", example: 30 },
            enrolled: { type: "number", example: 25 },
            instructorId: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            title: { type: "string", example: "Welcome to the course" },
            body: { type: "string", example: "This is the post content" },
            type: {
              type: "string",
              enum: ["discussion", "announcement"],
              example: "discussion",
            },
            courseId: { type: "string", example: "CS101" },
            sender: { $ref: "#/components/schemas/User" },
            attachmentsId: {
              type: "array",
              items: { type: "string" },
            },
            deadline: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            postId: { type: "string", example: "507f1f77bcf86cd799439012" },
            sender: { $ref: "#/components/schemas/User" },
            body: { type: "string", example: "Great post!" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Reaction: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            postId: { type: "string", example: "507f1f77bcf86cd799439012" },
            senderId: { type: "string", example: "507f1f77bcf86cd799439013" },
            type: {
              type: "string",
              enum: ["like", "love", "shocked", "laugh", "sad"],
              example: "like",
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        File: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            fileName: { type: "string", example: "document.pdf" },
            fileType: { type: "string", example: "application/pdf" },
            size: { type: "number", example: 1024000 },
            courseId: { type: "string", example: "CS101" },
            uploadedBy: { type: "string", example: "507f1f77bcf86cd799439012" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Chat: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            user1: { type: "string", example: "507f1f77bcf86cd799439012" },
            user2: { type: "string", example: "507f1f77bcf86cd799439013" },
            lastMessage: { type: "string", example: "Hello there!" },
            lastMessageTime: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Message: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            chatId: { type: "string", example: "507f1f77bcf86cd799439012" },
            senderId: { type: "string", example: "507f1f77bcf86cd799439013" },
            receiverId: { type: "string", example: "507f1f77bcf86cd799439014" },
            body: { type: "string", example: "Hello!" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Error message" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/swagger/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
