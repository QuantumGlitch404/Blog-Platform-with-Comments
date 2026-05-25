import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';
import PostCard from '../components/features/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import { CATEGORIES } from '../constants';

const HomePage = () => {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postService.getPosts({ limit: 7, sort: '-createdAt' });
        const posts = res.data || [];
        if (posts.length > 0) {
          setFeaturedPost(posts[0]);
          setLatestPosts(posts.slice(1));
        }
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary/50 to-bg-primary pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <p className="text-accent-highlight font-mono text-sm tracking-widest uppercase mb-6 animate-fadeIn">
              — Ideas that matter
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-8">
              Stories for the
              <br />
              <span className="text-text-secondary">curious mind</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-editorial max-w-xl mb-10 leading-relaxed">
              A platform built for depth. No algorithms. No noise. Just thoughtful writing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/blog" className="btn-primary text-base px-8 py-4">
                Start Reading
              </Link>
              <Link to="/register" className="btn-secondary text-base px-8 py-4">
                Write on B.
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {loading ? (
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <PostCardSkeleton />
        </section>
      ) : featuredPost && (
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-mono uppercase tracking-widest text-text-tertiary">Featured</h2>
          </div>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              className="px-4 py-2 rounded-full border border-border-subtle text-text-secondary text-sm hover:border-accent-highlight hover:text-accent-highlight transition-all duration-200"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-mono uppercase tracking-widest text-text-tertiary">Latest</h2>
          <Link to="/blog" className="text-sm text-accent-highlight hover:underline underline-offset-4">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
            Have something to say?
          </h2>
          <p className="text-text-secondary text-lg mb-10 font-editorial">
            Join a community of writers who value substance over clicks.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-4">
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
