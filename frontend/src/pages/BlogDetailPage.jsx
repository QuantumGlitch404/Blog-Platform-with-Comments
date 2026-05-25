import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { formatDate } from '../utils/formatDate';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import CommentSection from '../components/features/CommentSection';
import ReadingProgressBar from '../components/features/ReadingProgressBar';
import PostCard from '../components/features/PostCard';
import Skeleton from '../components/ui/Skeleton';
import { copyToClipboard } from '../utils/copyToClipboard';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await postService.getPostBySlug(slug);
      const p = res.data;
      setPost(p);
      setLikesCount(p.likedBy?.length || 0);
      setIsLiked(user && p.likedBy?.includes(user._id));

      // Track view
      postService.incrementView(p._id).catch(() => {});

      // Fetch related
      try {
        const relRes = await postService.getRelatedPosts(p._id);
        setRelated(relRes.data || []);
      } catch {}
    } catch (err) {
      addToast('Failed to load post', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return addToast('Please sign in to like posts', 'info');
    try {
      if (isLiked) {
        await postService.unlikePost(post._id);
        setLikesCount((c) => c - 1);
      } else {
        await postService.likePost(post._id);
        setLikesCount((c) => c + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    }
  };

  const handleBookmark = async () => {
    if (!user) return addToast('Please sign in to bookmark', 'info');
    try {
      if (isBookmarked) {
        await userService.unbookmarkPost(post._id);
      } else {
        await userService.bookmarkPost(post._id);
      }
      setIsBookmarked(!isBookmarked);
      addToast(isBookmarked ? 'Removed from bookmarks' : 'Bookmarked!', 'success');
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);
    addToast(success ? 'Link copied!' : 'Failed to copy link', success ? 'success' : 'error');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Skeleton height="40px" className="mb-4" />
        <Skeleton height="20px" width="60%" className="mb-8" />
        <Skeleton height="300px" className="mb-8 rounded-xl" />
        <Skeleton height="16px" className="mb-3" />
        <Skeleton height="16px" className="mb-3" />
        <Skeleton height="16px" width="70%" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-accent-highlight hover:underline">← Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar />
      <article className="min-h-screen">
        {/* Header */}
        <header className="max-w-3xl mx-auto px-4 pt-16 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className={`badge badge-${post.category?.toLowerCase()}`}>{post.category}</span>
            <span className="text-text-tertiary text-sm">{post.readingTime || 5} min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-text-secondary font-editorial mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Bar */}
          <div className="flex items-center justify-between py-6 border-y border-border-subtle">
            <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-4 group">
              <img
                src={post.author?.profileImage || 'https://via.placeholder.com/48'}
                alt={post.author?.name}
                className="w-12 h-12 rounded-full object-cover border border-border-subtle"
              />
              <div>
                <p className="font-semibold group-hover:text-accent-highlight transition-colors">{post.author?.name}</p>
                <p className="text-text-tertiary text-sm">{formatDate(post.createdAt)}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={handleLike} className={`p-2 rounded-full transition-colors ${isLiked ? 'text-accent-danger' : 'text-text-tertiary hover:text-text-primary'}`} title="Like">
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
              <span className="text-sm text-text-tertiary">{likesCount}</span>
              <button onClick={handleBookmark} className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-accent-highlight' : 'text-text-tertiary hover:text-text-primary'}`} title="Bookmark">
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </button>
              <button onClick={handleShare} className="p-2 rounded-full text-text-tertiary hover:text-text-primary transition-colors" title="Share">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl object-cover max-h-[500px]" />
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4">
          <div
            className="prose-custom drop-cap"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border-subtle">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/tag/${tag}`} className="px-3 py-1 rounded-full text-xs border border-border-subtle text-text-secondary hover:border-accent-highlight hover:text-accent-highlight transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Comments */}
          <CommentSection postId={post._id} />
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-20 mt-16 border-t border-border-subtle">
            <h2 className="text-sm font-mono uppercase tracking-widest text-text-tertiary mb-8">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          </section>
        )}
      </article>
    </>
  );
};

export default BlogDetailPage;
