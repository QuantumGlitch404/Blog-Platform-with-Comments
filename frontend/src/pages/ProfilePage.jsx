import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PostCard from '../components/features/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [userRes, statsRes, postsRes] = await Promise.all([
        userService.getUserProfile(id),
        userService.getUserStats(id),
        postService.getPosts({ author: id, limit: 12 }),
      ]);
      setProfileUser(userRes.data);
      setStats(statsRes.data);
      setPosts(postsRes.data || []);
      setIsFollowing(currentUser && userRes.data.followers?.includes(currentUser._id));
    } catch (err) {
      addToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return addToast('Please sign in', 'info');
    try {
      if (isFollowing) {
        await userService.unfollowUser(id);
      } else {
        await userService.followUser(id);
      }
      setIsFollowing(!isFollowing);
      fetchProfile();
    } catch (err) {
      addToast('Action failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 rounded-full skeleton mb-4" />
          <div className="skeleton w-48 h-6 mb-2" />
          <div className="skeleton w-64 h-4" />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">User not found</h1>
          <Link to="/" className="text-accent-highlight hover:underline">← Go home</Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === id;

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <img
            src={profileUser.profileImage || 'https://via.placeholder.com/120'}
            alt={profileUser.name}
            className="w-28 h-28 rounded-full object-cover border-2 border-border-subtle"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold mb-2">{profileUser.name}</h1>
            {profileUser.bio && (
              <p className="text-text-secondary font-editorial max-w-xl mb-4">{profileUser.bio}</p>
            )}
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-text-secondary mb-6">
              <span><strong className="text-text-primary">{stats?.totalPosts || 0}</strong> posts</span>
              <span><strong className="text-text-primary">{stats?.followersCount || 0}</strong> followers</span>
              <span><strong className="text-text-primary">{stats?.totalViews || 0}</strong> views</span>
            </div>
            {!isOwnProfile && currentUser && (
              <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
            {isOwnProfile && (
              <Link to="/settings" className="btn-secondary text-sm px-4 py-2">Edit Profile</Link>
            )}
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest text-text-tertiary mb-8">Published Stories</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
          ) : (
            <p className="text-text-tertiary text-center py-12">No published stories yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
