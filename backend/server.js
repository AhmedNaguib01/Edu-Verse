const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/config");
const connectDB = require("./database/connection");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use( "/api-docs", swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "EduVerse API Documentation",
  })
);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "EduVerse API is running" });
});

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/chats", require("./routes/chats"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/files", require("./routes/files"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/reactions", require("./routes/reactions"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid token" });
  }
  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(409).json({ error: "Duplicate key error" });
  }
  res.status(500).json({ error: "Internal server error" });

});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
