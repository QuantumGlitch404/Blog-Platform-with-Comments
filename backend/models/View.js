const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    ipAddress: String,
    userAgent: String,
    referrer: String,
    country: String,
    duration: {
      type: Number,
      default: 0,
    }, // seconds
    scrollDepth: {
      type: Number,
      default: 0,
    }, // 0-100 percentage
  },
  {
    timestamps: true,
  }
);

// Indexes
viewSchema.index({ post: 1, createdAt: -1 });
viewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('View', viewSchema);
