const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  _id: String, // code for course ID
  name: String,
  creditHours: Number,
  description: String,
  instructorId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  enrolled: { type: Number, default: 0 },
  capacity: { type: Number, default: 100 },
});

module.exports = mongoose.model("Course", courseSchema);
