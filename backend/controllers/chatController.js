const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// Get all chats for current user (OPTIMIZED)
const getAllChats = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    const limitNum = Math.min(parseInt(limit), 100);

    // Find all chats where user is either user1 or user2
    const [chats, total] = await Promise.all([
      Chat.find({
        $or: [{ "user1.id": userId }, { "user2.id": userId }],
      })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Chat.countDocuments({
        $or: [{ "user1.id": userId }, { "user2.id": userId }],
      }),
    ]);

    res.json({
      chats,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get all chats error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get chat by ID (OPTIMIZED)
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).lean();
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Check if user is part of this chat
    if (
      chat.user1.id.toString() !== req.userId &&
      chat.user2.id.toString() !== req.userId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Add cache headers
    res.setHeader("Cache-Control", "private, max-age=60");
    res.json(chat);
  } catch (error) {
    console.error("Get chat by ID error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create or get existing chat
const createChat = async (req, res) => {
  try {
    const { user2Id } = req.body;
    const user1Id = req.userId;

    if (!user2Id) {
      return res.status(400).json({ error: "user2Id is required" });
    }

    if (user1Id === user2Id) {
      return res
        .status(400)
        .json({ error: "Cannot create chat with yourself" });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      $or: [
        { "user1.id": user1Id, "user2.id": user2Id },
        { "user1.id": user2Id, "user2.id": user1Id },
      ],
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Get user details
    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);

    if (!user2) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create new chat
    const chat = new Chat({
      user1: {
        id: user1._id,
        name: user1.name,
        image: user1.image ? Buffer.from(user1.image) : null,
      },
      user2: {
        id: user2._id,
        name: user2.name,
        image: user2.image ? Buffer.from(user2.image) : null,
      },
      lastMessage: "",
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllChats,
  getChatById,
  createChat,
};
