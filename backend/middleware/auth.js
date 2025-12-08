const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

const isInstructor = (req, res, next) => {
  if (req.userRole !== "instructor") {
    return res.status(403).json({ error: "Instructor access required" });
  }
  next();
};

module.exports = { auth, isInstructor };
