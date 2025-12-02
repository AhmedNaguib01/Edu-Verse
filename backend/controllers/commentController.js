const Comment = require("../models/Comment");

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: "postId is required" });
    }

    const comments = await Comment.find({ postId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { postId, body, parentCommentId } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!postId || !body) {
      return res.status(400).json({ error: "postId and body are required" });
    }

    // Get user info
    const User = require("../models/User");
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comment = new Comment({
      postId,
      sender: {
        id: user._id,
        name: user.name,
        profilePicture: user.profilePicture || null,
      },
      body,
      parentCommentId: parentCommentId || null,
      createdAt: new Date(),
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user owns the comment
    if (req.userId && comment.sender.id.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
