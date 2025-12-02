const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  },
  courseId: String,
  title: String,
  body: String,
  attachmentsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  image: String, // Base64 encoded image data
  type: {
    type: String,
    enum: ["question", "announcement", "discussion", "event"],
  },
  answered: Boolean,
  deadline: Date, // For announcements with deadlines
  eventDate: Date, // For events
  eventLocation: String, // For events
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
