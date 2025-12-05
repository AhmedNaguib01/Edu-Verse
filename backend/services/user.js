const User = require("../models/User");
const Post = require("../models/Post");
const Course = require("../models/Course");

// Get user profile by ID (OPTIMIZED)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean(); // Faster read-only query

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add cache headers for profile data
    res.setHeader("Cache-Control", "private, max-age=300"); // 5 minutes
    res.json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is updating their own profile
    if (req.userId !== id) {
      return res
        .status(403)
        .json({ error: "You can only update your own profile" });
    }

    const { name, email, level, image, bio, profilePicture, password } =
      req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (level) updateData.level = level;
    if (image) updateData.image = image;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (bio !== undefined) updateData.bio = bio;

    // Hash password if provided
    if (password) {
      const bcrypt = require("bcrypt");
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update user profile error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// Get user posts (OPTIMIZED)
const getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const limitNum = Math.min(parseInt(limit), 50);

    const [posts, total, userData] = await Promise.all([
      Post.find({ "sender.id": req.params.id })
        .select("title body type courseId createdAt attachmentsId sender")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Post.countDocuments({ "sender.id": req.params.id }),
      User.findById(req.params.id).select("name profilePicture").lean(),
    ]);

    // Update posts with fresh user data
    const updatedPosts = posts.map((post) => ({
      ...post,
      sender: {
        ...post.sender,
        name: userData?.name || post.sender?.name,
        profilePicture: userData?.profilePicture || post.sender?.profilePicture,
      },
    }));

    res.json({
      posts: updatedPosts,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user courses
const getUserCourses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(
      "Getting courses for user:",
      user.name,
      "Role:",
      user.role,
      "ID:",
      user._id
    );

    let courses = [];

    // If user is an instructor, get courses they teach
    if (user.role === "instructor") {
      console.log("Searching for courses with instructorId:", user._id);
      courses = await Course.find({
        instructorId: user._id,
      }).populate("instructorId", "name email");
      console.log("Found courses:", courses.length);
    } else {
      // For students, get enrolled courses
      console.log("Searching for enrolled courses:", user.courses);
      courses = await Course.find({ _id: { $in: user.courses } }).populate(
        "instructorId",
        "name email"
      );
      console.log("Found courses:", courses.length);
    }

    res.json(courses);
  } catch (error) {
    console.error("Get user courses error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Search users (OPTIMIZED)
const searchUsers = async (req, res) => {
  try {
    const { query, role, limit = 20 } = req.query;

    const searchQuery = {};

    // Add role filter if provided
    if (role) {
      searchQuery.role = role;
    }

    // Add text search if provided
    if (query && query.trim().length >= 2) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    // Exclude current user if authenticated
    if (req.userId) {
      searchQuery._id = { $ne: req.userId };
    }

    const limitNum = Math.min(parseInt(limit), 50);
    const users = await User.find(searchQuery)
      .select("name email role profilePicture level")
      .limit(limitNum)
      .lean();

    // Add short cache for search results
    res.setHeader("Cache-Control", "private, max-age=60"); // 1 minute
    res.json(users);
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user activity stats (OPTIMIZED)
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const Comment = require("../models/Comment");
    const Reaction = require("../models/Reaction");

    // Parallel execution for better performance
    const [postsCount, commentsCount, reactionsCount] = await Promise.all([
      Post.countDocuments({ "sender.id": userId }),
      Comment.countDocuments({ "sender.id": userId }),
      Reaction.countDocuments({ senderId: userId }),
    ]);

    const stats = {
      posts: postsCount,
      comments: commentsCount,
      reactions: reactionsCount,
    };

    // Cache stats for 5 minutes
    res.setHeader("Cache-Control", "private, max-age=300");
    res.json(stats);
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserPosts,
  getUserCourses,
  searchUsers,
  getUserStats,
};
