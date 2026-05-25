const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ROLES = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    profileImage: {
      type: String,
      default: 'default.jpg',
    },
    location: {
      type: String,
      maxlength: 100,
      default: '',
    },
    website: {
      type: String,
      match: [/^https?:\/\//, 'Please use a valid URL with HTTP or HTTPS'],
      default: '',
    },
    socialLinks: {
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    emailPreferences: {
      newsletter: { type: Boolean, default: true },
      commentNotifications: { type: Boolean, default: true },
      likeNotifications: { type: Boolean, default: true },
      followNotifications: { type: Boolean, default: true },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    
    // Auth & Security
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    lastLogin: Date,
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    suspendedReason: String,
    suspendedUntil: Date,
    
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: Date,
    passwordHistory: [{
      hash: String,
      changedAt: Date,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;

  // Add to password history if new/changed
  this.passwordHistory.push({
    hash: hash,
    changedAt: Date.now(),
  });

  // Keep only last 3 passwords
  if (this.passwordHistory.length > 3) {
    this.passwordHistory.shift();
  }
});

// Match user entered password to hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash email verification token
userSchema.methods.generateVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to verificationToken field
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  return verificationToken;
};

// Generate and hash password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Statics
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.incrementLoginAttempts = function(userId) {
  return this.findByIdAndUpdate(userId, {
    $inc: { loginAttempts: 1 },
    // Lock for 15 minutes after 5 failed attempts
    $set: { lockedUntil: Date.now() + 15 * 60 * 1000 }
  }); // Need to handle logic carefully, update takes complex objects or we do it in two steps.
};

// Correcting incrementLoginAttempts
userSchema.statics.incrementLoginAttempts = async function(userId) {
  const user = await this.findById(userId);
  if (!user) return;

  user.loginAttempts += 1;
  if (user.loginAttempts >= 5) {
    user.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins
  }
  return user.save({ validateBeforeSave: false });
};

userSchema.statics.resetLoginAttempts = function(userId) {
  return this.findByIdAndUpdate(userId, {
    loginAttempts: 0,
    lockedUntil: null,
    lastLogin: Date.now(),
  });
};

module.exports = mongoose.model('User', userSchema);
