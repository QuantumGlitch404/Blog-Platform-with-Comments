const User = require('../models/User');
const Post = require('../models/Post');
const { createNotification } = require('../utils/createNotification');
const { NOT_FOUND } = require('../constants/errorCodes');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email -emailPreferences -passwordHistory');
    
    if (!user) return res.error('User not found', 404, NOT_FOUND);
    res.success(user);
  } catch (err) {
    next(err);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.error('You cannot follow yourself', 400);
    }

    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) return res.error('User not found', 404, NOT_FOUND);

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: userToFollow._id } });
    await User.findByIdAndUpdate(userToFollow._id, { $addToSet: { followers: req.user.id } });

    await createNotification({
      recipient: userToFollow._id,
      sender: req.user.id,
      type: 'follow',
    });

    res.success({}, 'Successfully followed user');
  } catch (err) {
    next(err);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } });

    res.success({}, 'Successfully unfollowed user');
  } catch (err) {
    next(err);
  }
};

exports.bookmarkPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.error('Post not found', 404, NOT_FOUND);

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { bookmarks: post._id } });
    res.success({}, 'Post bookmarked');
  } catch (err) {
    next(err);
  }
};

exports.unbookmarkPost = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { bookmarks: req.params.postId } });
    res.success({}, 'Post removed from bookmarks');
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'name profileImage' }
    });
    res.success(user.bookmarks);
  } catch (err) {
    next(err);
  }
};

exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.error('User not found', 404, NOT_FOUND);

    const posts = await Post.find({ author: user._id });
    
    const totalViews = posts.reduce((acc, post) => acc + post.views, 0);
    const totalLikes = posts.reduce((acc, post) => acc + (post.likedBy ? post.likedBy.length : 0), 0);
    
    res.success({
      totalPosts: posts.length,
      totalViews,
      totalLikes,
      followersCount: user.followers.length,
    });
  } catch (err) {
    next(err);
  }
};
