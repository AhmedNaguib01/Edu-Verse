const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },

    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    image: { type: Object, default: {} },

    level: { type: String, default: "" },
    courses: { type: [String], default: [] },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },
    
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
