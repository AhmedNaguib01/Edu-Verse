const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user1: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    image: Buffer,
  },
  user2: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    image: Buffer,
  },
  lastMessage: String,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
