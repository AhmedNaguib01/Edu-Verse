const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware to check if user is instructor
const isInstructor = (req, res, next) => {
  if (req.userRole !== "instructor" && req.userRole !== "admin") {
    return res.status(403).json({ error: "Instructor access required" });
  }
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { auth, isInstructor, isAdmin };
