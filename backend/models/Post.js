const mongoose = require('mongoose');
const slugify = require('../utils/slugify');
const CATEGORIES = require('../constants/categories');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    thumbnail: {
      type: String,
      default: 'default-post.jpg',
    },
    gallery: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    ogImage: String,
    scheduledFor: Date,
    series: {
      name: String,
      order: Number,
    },
    tableOfContents: [{
      heading: String,
      id: String,
      level: Number,
    }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: {
      type: Number,
      default: 0,
    },
    readTime: Number, // in minutes
    wordCount: Number,
    versionHistory: [{
      content: String,
      updatedAt: Date,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ views: -1 });
postSchema.index({ category: 1, createdAt: -1 });

// Virtuals
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

postSchema.virtual('likesCount').get(function() {
  return this.likedBy ? this.likedBy.length : 0;
});

// Pre-save hooks
postSchema.pre('save', function (next) {
  // Generate slug
  if (this.isModified('title')) {
    this.slug = slugify(this.title);
  }

  // Calculate word count and read time
  if (this.isModified('content')) {
    const textOnly = this.content.replace(/<[^>]*>?/gm, ' ');
    const words = textOnly.trim().split(/\s+/);
    this.wordCount = words.length > 0 && words[0] !== '' ? words.length : 0;
    this.readTime = Math.ceil(this.wordCount / 200); // avg 200 wpm
    
    // Extract TOC
    const headingRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
    const toc = [];
    let match;
    while ((match = headingRegex.exec(this.content)) !== null) {
      const level = parseInt(match[1]);
      const heading = match[2].replace(/<[^>]*>/g, '').trim();
      const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc.push({ level, heading, id });
    }
    this.tableOfContents = toc;
  }

  next();
});

// Statics
postSchema.statics.search = function(query) {
  return this.find(
    { $text: { $search: query }, published: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Post', postSchema);
