const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
     // Basic User Information
  firstName: {
    type: String,
    required: [true, "Please tell us your first name!"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your last name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
        validator: function (el) {
            return el === this.password;
        },
    },
  },
  profilePicture: {
    type: String, // Store image URLs or use a separate image storage solution,
    default: "default.jpg",
  },
  
  // Additional Profile Information
  bio: {
    type: String,
  },
  interests: {
    type: [String], // An array to store user interests
  },
  
  // Campus Information
  college: {
    type: String,
    required: true,
  },
  major: {
    type: String,
  },
  graduationYear: {
    type: Number,
  },
  
  // User Role (e.g., Student, Faculty, Staff)
  role: {
    type: String,
    enum: ['Student', 'Faculty', 'Staff'],
    default: 'Student',
  },
  
  // Social Media Links
  socialLinks: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
  }
}, {timestamps: true,});


const User = mongoose.model("User", userSchema);

module.exports = User;