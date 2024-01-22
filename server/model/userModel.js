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
    enum: ['student', 'faculty', 'staff', 'admin'],
    default: 'student',
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



userSchema.pre('save', async function (next) {
  // Update timestamps
  now = new Date();
  this.updated_at = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }

  // Only run this function, if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 14);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password' || this.isNew)) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next(0);
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};


userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // console.log({
  //   resetToken,
  //   passReset: this.passwordResetToken,
  // });

  return resetToken;
};


const User = mongoose.model("User", userSchema);


module.exports = User;