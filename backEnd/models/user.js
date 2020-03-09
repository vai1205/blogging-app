const mongoose = require("mongoose");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      require: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      require: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
      lowercase: true
    },
    profile: {
      type: String,
      require: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    about: {
      type: String
    },
    role: {
      type: Number,
      trim: true
    },
    photo: {
      type: Buffer,
      contentType: String
    },
    resetPasswordLink: {
      data: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
