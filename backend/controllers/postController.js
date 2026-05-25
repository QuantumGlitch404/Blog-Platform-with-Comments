const mongoose = require('mongoose');
const Post = require('../models/Post');
const View = require('../models/View');
const { createNotification } = require('../utils/createNotification');
const { NOT_FOUND } = require('../constants/errorCodes');

exports.getPosts = async (req, res, next) => {
  // Uses pagination middleware, results attached to res.paginatedResults
  res.status(200).json({
    success: true,
    ...res.paginatedResults,
  });
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profileImage bio')
      .populate('collaborators', 'name profileImage');

    if (!post) {
      return res.error('Post not found', 404, NOT_FOUND);
    }

    res.success(post);
  } catch (err) {
    next(err);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name profileImage bio')
      .populate('collaborators', 'name profileImage');

    if (!post) {
      return res.error('Post not found', 404, NOT_FOUND);
    }

    res.success(post);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    const post = await Post.create(req.body);
    res.success(post, 'Post created successfully', {}, 201);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.error('Post not found', 404, NOT_FOUND);
    }

    // Save version history
    const historyEntry = {
      content: post.content,
      updatedAt: Date.now(),
      updatedBy: req.user.id,
    };

    req.body.versionHistory = [...(post.versionHistory || []), historyEntry];

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.success(post, 'Post updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.error('Post not found', 404, NOT_FOUND);
    }

    await post.deleteOne(); // Use deleteOne to trigger pre('deleteOne') hooks if we add them
    res.success({}, 'Post deleted successfully');
  } catch (err) {
    next(err);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.error('Post not found', 404, NOT_FOUND);
    }

    if (post.likedBy.includes(req.user.id)) {
      return res.error('Post already liked', 400);
    }

    post.likedBy.push(req.user.id);
    await post.save();

    // Notify author
    await createNotification({
      recipient: post.author,
      sender: req.user.id,
      type: 'like',
      post: post._id,
    });

    res.success({ likes: post.likesCount }, 'Post liked');
  } catch (err) {
    next(err);
  }
};

exports.unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likedBy: req.user.id } },
      { new: true }
    );

    if (!post) {
      return res.error('Post not found', 404, NOT_FOUND);
    }

    res.success({ likes: post.likesCount }, 'Post unliked');
  } catch (err) {
    next(err);
  }
};

exports.incrementView = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.error('Post not found', 404);

    post.views += 1;
    await post.save();

    // Create detailed view record
    await View.create({
      post: post._id,
      user: req.user ? req.user.id : null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer'),
    });

    res.success({ views: post.views });
  } catch (err) {
    next(err);
  }
};

exports.getRelatedPosts = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.error('Post not found', 404);
    
    const related = await Post.aggregate([
      {
        $match: {
          _id: { $ne: post._id },
          published: true,
          $or: [
            { category: post.category },
            { tags: { $in: post.tags } },
            { author: post.author },
          ],
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $cond: [{ $eq: ['$category', post.category] }, 3, 0] },
              { $multiply: [
                { $size: { $setIntersection: [{ $ifNull: ['$tags', []] }, { $ifNull: [post.tags, []] }] } },
                2
              ]},
              { $cond: [{ $eq: ['$author', post.author] }, 1, 0] },
            ],
          },
        },
      },
      { $sort: { score: -1, views: -1 } },
      { $limit: 3 },
    ]);
    
    res.success(related);
  } catch (err) {
    next(err);
  }
};
