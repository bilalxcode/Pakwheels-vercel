const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    phoneNumber: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    userType: {
      type: String,
      default: "regular",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
