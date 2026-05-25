import { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import PostCard from '../components/features/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import { CATEGORIES } from '../constants';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchPosts();
  }, [page, activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort: '-createdAt' };
      if (activeCategory !== 'All') params.category = activeCategory;
      const res = await postService.getPosts(params);
      setPosts(res.data || []);
      setTotalPages(res.meta?.pagination?.pages || 1);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Explore</h1>
          <p className="text-text-secondary font-editorial text-lg">Discover stories, ideas, and expertise.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border-subtle">
          <button
            onClick={() => { setActiveCategory('All'); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
              activeCategory === 'All'
                ? 'bg-accent-highlight text-bg-primary font-medium'
                : 'border border-border-subtle text-text-secondary hover:border-accent-highlight hover:text-accent-highlight'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-accent-highlight text-bg-primary font-medium'
                  : 'border border-border-subtle text-text-secondary hover:border-accent-highlight hover:text-accent-highlight'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-tertiary text-lg">No posts found.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-16">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-30"
            >
              ← Previous
            </button>
            <span className="text-text-tertiary text-sm font-mono">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
