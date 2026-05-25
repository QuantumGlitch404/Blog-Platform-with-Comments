import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatDate';

const PostCard = ({ post, featured = false }) => {
  if (!post) return null;

  const categoryLower = post.category?.toLowerCase() || 'other';

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`} className="group block">
        <article className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-bg-secondary rounded-2xl overflow-hidden border border-border-subtle hover-lift">
          <div className="h-64 md:h-full w-full overflow-hidden">
            <img 
              src={post.coverImage || 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800'} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className={`badge badge-${categoryLower}`}>
                {post.category}
              </span>
              <span className="text-text-tertiary text-sm">{formatRelativeTime(post.createdAt)}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 group-hover:text-accent-highlight transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-text-secondary font-editorial text-lg mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center mt-auto">
              <img src={post.author?.profileImage || 'https://via.placeholder.com/40'} alt={post.author?.name} className="w-10 h-10 rounded-full mr-3 border border-border-subtle" />
              <div>
                <p className="font-medium text-sm">{post.author?.name}</p>
                <p className="text-text-tertiary text-xs">{post.readingTime} min read</p>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <article className="card h-full flex flex-col hover-lift">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className={`badge badge-${categoryLower}`}>
              {post.category}
            </span>
            <span className="text-text-tertiary text-xs">{formatRelativeTime(post.createdAt)}</span>
          </div>
          <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-accent-highlight transition-colors text-2-line">
            {post.title}
          </h3>
          <p className="text-text-secondary font-editorial text-sm text-3-line mb-6">
            {post.excerpt}
          </p>
        </div>
        
        <div className="flex items-center mt-auto pt-4 border-t border-border-subtle">
          <img src={post.author?.profileImage || 'https://via.placeholder.com/40'} alt={post.author?.name} className="w-8 h-8 rounded-full mr-3 border border-border-subtle" />
          <div className="flex-1">
            <p className="font-medium text-sm text-1-line">{post.author?.name}</p>
            <div className="flex items-center justify-between">
               <p className="text-text-tertiary text-xs">{post.readingTime} min read</p>
               <div className="flex items-center gap-1 text-text-tertiary text-xs">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 {post.views}
               </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
