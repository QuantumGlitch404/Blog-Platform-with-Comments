const Post = require('../models/Post');
const User = require('../models/User');

exports.search = async (req, res, next) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.success({ posts: [], users: [] });
    }

    const results = {};

    if (!type || type === 'posts') {
      // Use text search for posts
      results.posts = await Post.find(
        { $text: { $search: q }, published: true },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .populate('author', 'name profileImage')
        .limit(20);
        
      // Fallback to regex if no text score (in case text index isn't hit right)
      if(results.posts.length === 0) {
          results.posts = await Post.find({
              $or: [
                  { title: { $regex: q, $options: 'i' } },
                  { content: { $regex: q, $options: 'i' } }
              ],
              published: true
          }).populate('author', 'name profileImage').limit(20);
      }
    }

    if (!type || type === 'users') {
      results.users = await User.find({
        name: { $regex: q, $options: 'i' },
      })
        .select('name profileImage bio followers')
        .limit(20);
    }

    res.success(results);
  } catch (err) {
    next(err);
  }
};
