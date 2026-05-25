import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { searchService } from '../../services/searchService';
import { useClickOutside } from '../../hooks/useClickOutside';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef();
  const debouncedQuery = useDebounce(query, 300);

  useClickOutside(containerRef, () => setShowResults(false));

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) {
      setResults({ posts: [], users: [] });
      setShowResults(false);
      return;
    }
    setLoading(true);
    setShowResults(true);
    try {
      const res = await searchService.search(val);
      setResults(res.data || { posts: [], users: [] });
    } catch {
      setResults({ posts: [], users: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      onClose && onClose();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search posts, authors..."
            className="input-base pl-10 pr-4"
            autoFocus
          />
        </div>
      </form>

      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-bg-secondary border border-border-subtle rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-text-tertiary">Searching...</div>
          ) : (
            <>
              {results.posts?.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-xs font-medium text-text-tertiary uppercase tracking-wider bg-bg-elevated">Posts</p>
                  {results.posts.slice(0, 5).map((post) => (
                    <button
                      key={post._id}
                      onClick={() => { navigate(`/blog/${post.slug}`); setShowResults(false); onClose && onClose(); }}
                      className="block w-full text-left px-4 py-3 hover:bg-bg-hover transition-colors"
                    >
                      <p className="font-medium text-sm text-1-line">{post.title}</p>
                      <p className="text-xs text-text-tertiary mt-1">{post.author?.name}</p>
                    </button>
                  ))}
                </div>
              )}
              {results.users?.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-xs font-medium text-text-tertiary uppercase tracking-wider bg-bg-elevated">Authors</p>
                  {results.users.slice(0, 3).map((u) => (
                    <button
                      key={u._id}
                      onClick={() => { navigate(`/profile/${u._id}`); setShowResults(false); onClose && onClose(); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-bg-hover transition-colors"
                    >
                      <img src={u.profileImage || 'https://via.placeholder.com/32'} alt={u.name} className="w-8 h-8 rounded-full" />
                      <span className="text-sm">{u.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.posts?.length === 0 && results.users?.length === 0 && query.length >= 2 && (
                <div className="p-6 text-center text-text-tertiary text-sm">No results found</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
