const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { createNotification } = require('../utils/createNotification');
const { NOT_FOUND } = require('../constants/errorCodes');

exports.getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    // Nested replies using aggregation graphLookup
    const comments = await Comment.aggregate([
      { $match: { post: new mongoose.Types.ObjectId(postId) } },
      {
        $graphLookup: {
          from: 'comments',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentComment',
          as: 'replies',
          depthField: 'depth',
        },
      },
      { $match: { parentComment: null } },
      { $sort: { createdAt: 1 } },
    ]);
    
    res.success(comments);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.body;
    
    const post = await Post.findById(postId);
    if (!post) return res.error('Post not found', 404, NOT_FOUND);

    const comment = await Comment.create({
      text: req.body.text,
      post: postId,
      user: req.user.id,
    });

    await createNotification({
      recipient: post.author,
      sender: req.user.id,
      type: 'comment',
      post: postId,
      comment: comment._id,
    });

    res.success(comment, 'Comment created successfully', {}, 201);
  } catch (err) {
    next(err);
  }
};

exports.replyToComment = async (req, res, next) => {
  try {
    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) return res.error('Parent comment not found', 404, NOT_FOUND);

    const comment = await Comment.create({
      text: req.body.text,
      post: parentComment.post,
      user: req.user.id,
      parentComment: parentComment._id,
    });

    await createNotification({
      recipient: parentComment.user,
      sender: req.user.id,
      type: 'reply',
      post: parentComment.post,
      comment: comment._id,
    });

    res.success(comment, 'Reply created successfully', {}, 201);
  } catch (err) {
    next(err);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.error('Comment not found', 404, NOT_FOUND);

    comment.text = req.body.text;
    comment.edited = true;
    comment.editedAt = Date.now();
    await comment.save();

    res.success(comment, 'Comment updated');
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.error('Comment not found', 404, NOT_FOUND);

    // TODO: also delete nested replies

    await comment.deleteOne();
    res.success({}, 'Comment deleted');
  } catch (err) {
    next(err);
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likedBy: req.user.id } },
      { new: true }
    );
    if (!comment) return res.error('Comment not found', 404, NOT_FOUND);
    res.success({ likes: comment.likesCount });
  } catch (err) {
    next(err);
  }
};

exports.unlikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $pull: { likedBy: req.user.id } },
      { new: true }
    );
    if (!comment) return res.error('Comment not found', 404, NOT_FOUND);
    res.success({ likes: comment.likesCount });
  } catch (err) {
    next(err);
  }
};
