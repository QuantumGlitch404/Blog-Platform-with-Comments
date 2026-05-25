import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchService } from '../services/searchService';
import PostCard from '../components/features/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await searchService.search(query);
      setResults(res.data || { posts: [], users: [] });
    } catch {
      setResults({ posts: [], users: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-2">
          Search results for <span className="text-accent-highlight">"{query}"</span>
        </h1>
        <p className="text-text-tertiary mb-10">
          {loading ? 'Searching...' : `${(results.posts?.length || 0) + (results.users?.length || 0)} results found`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {results.posts?.length > 0 && (
              <div className="mb-12">
                <h2 className="text-sm font-mono uppercase tracking-widest text-text-tertiary mb-6">Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.posts.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
              </div>
            )}
            {results.users?.length > 0 && (
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest text-text-tertiary mb-6">Authors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.users.map((u) => (
                    <a key={u._id} href={`/profile/${u._id}`} className="card flex items-center gap-4 hover-lift">
                      <img src={u.profileImage || 'https://via.placeholder.com/48'} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-text-tertiary text-sm">{u.bio?.slice(0, 60) || 'No bio'}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {results.posts?.length === 0 && results.users?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-tertiary text-lg">No results matched your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
