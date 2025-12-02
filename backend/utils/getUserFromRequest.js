const User = require("../models/User");

/**
 * Get user object from request using userId set by auth middleware
 */
const getUserFromRequest = async (req) => {
  if (!req.userId) {
    return null;
  }

  try {
    const user = await User.findById(req.userId).select("-password");
    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
};

module.exports = getUserFromRequest;
