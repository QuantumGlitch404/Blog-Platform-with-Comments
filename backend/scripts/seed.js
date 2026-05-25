require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const View = require('../models/View');
const Report = require('../models/Report');

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');
    
    console.log('Clearing old data...');
    await Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Comment.deleteMany(),
      Notification.deleteMany(),
      View.deleteMany(),
      Report.deleteMany(),
    ]);

    const password = await bcrypt.hash('Password123!', 12);
    const passwordHistory = [{ hash: password, changedAt: Date.now() }];

    console.log('Creating users...');
    const users = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password,
        passwordHistory,
        role: 'admin',
        bio: 'Full-stack developer passionate about clean code and user experience.',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        location: 'San Francisco, CA',
        website: 'https://alice.dev',
        socialLinks: { twitter: '@alicecodes', github: 'alicej' },
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password,
        passwordHistory,
        bio: 'UX designer and frontend enthusiast.',
      },
      {
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        password,
        passwordHistory,
        bio: 'Backend engineer.',
      },
      {
        name: 'Diana Prince',
        email: 'diana@example.com',
        password,
        passwordHistory,
        bio: 'AI researcher.',
      },
      {
        name: 'Eve Adams',
        email: 'eve@example.com',
        password,
        passwordHistory,
      }
    ]);

    console.log('Creating posts...');
    const posts = await Post.create([
      {
        title: 'Why Your React Components Are Slow (And How to Fix It)',
        content: `<h1>Performance Matters</h1><p>React's virtual DOM is fast, but your components might not be. Here are the top 5 mistakes...</p><h2>1. Unnecessary Re-renders</h2><p>The biggest culprit is missing React.memo or improper useMemo usage...</p><pre><code>const ExpensiveComponent = React.memo(({ data }) => {\n  const processed = useMemo(() => heavyComputation(data), [data]);\n  return &lt;div&gt;{processed}&lt;/div&gt;;\n});</code></pre><h2>2. Large Bundle Sizes</h2><p>Code-split aggressively...</p>`,
        excerpt: 'Five common React performance issues and practical solutions.',
        author: users[0]._id,
        category: 'Technology',
        tags: ['react', 'performance', 'optimization'],
        published: true,
        featured: true,
        metaDescription: 'Learn how to optimize React component performance with practical examples.',
        views: 1500,
        likedBy: [users[1]._id, users[2]._id, users[3]._id],
      },
      {
        title: 'The Future of Web Design in 2026',
        content: `<h1>Trends</h1><p>Minimalism is evolving. We are moving away from generic templates to more expressive designs.</p><h2>Dark Mode by Default</h2><p>AMOLED displays are everywhere. Pure black is beautiful and saves battery.</p>`,
        excerpt: 'Exploring the design trends that will dominate the web this year.',
        author: users[1]._id,
        category: 'Design',
        tags: ['ui', 'ux', 'trends'],
        published: true,
        views: 800,
        likedBy: [users[0]._id],
      },
      {
        title: 'Building Scalable APIs with Node.js',
        content: `<h1>Architecture</h1><p>Monolith vs Microservices? Let's discuss when to use which.</p><h2>Caching</h2><p>Redis is your best friend when things get slow.</p>`,
        excerpt: 'A comprehensive guide to scaling backend services.',
        author: users[2]._id,
        category: 'Technology',
        tags: ['nodejs', 'backend', 'scaling'],
        published: true,
        views: 1200,
        likedBy: [users[0]._id, users[1]._id],
      }
    ]);

    console.log('Creating comments...');
    const comments = await Comment.create([
      {
        post: posts[0]._id,
        user: users[1]._id,
        text: 'Great article! I especially liked the memo section.',
      },
      {
        post: posts[1]._id,
        user: users[0]._id,
        text: 'Totally agree on dark mode by default.',
      }
    ]);

    // Create a reply
    const reply = await Comment.create({
      post: posts[0]._id,
      user: users[2]._id,
      text: 'What about useCallback? Should we memoize handlers too?',
      parentComment: comments[0]._id,
    });

    console.log('Setting up relationships (followers, bookmarks)...');
    await User.findByIdAndUpdate(users[0]._id, {
      $push: { 
        followers: users[1]._id,
        following: users[2]._id,
        bookmarks: posts[1]._id,
      },
    });

    console.log('✅ Seed completed:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Comments: 3`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
