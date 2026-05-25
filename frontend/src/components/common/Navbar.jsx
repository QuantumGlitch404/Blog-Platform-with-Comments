import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../features/NotificationBell';
import { ROUTES } from '../../constants';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="text-2xl font-display font-bold tracking-tighter">
              B<span className="text-accent-highlight">.</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to={ROUTES.BLOG} className="text-text-secondary hover:text-text-primary transition-colors">
              Explore
            </Link>
            <Link to={ROUTES.ABOUT} className="text-text-secondary hover:text-text-primary transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={ROUTES.CREATE_POST}
                  className="hidden md:inline-flex btn-secondary text-sm px-4 py-2"
                >
                  Write
                </Link>
                <NotificationBell />
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-bg-elevated transition-colors">
                    <img
                      src={user.profileImage || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-border-subtle"
                    />
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-subtle rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="p-2">
                      <Link to={`/profile/${user._id}`} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded">
                        Profile
                      </Link>
                      <Link to={ROUTES.DASHBOARD} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded">
                        Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-accent-danger hover:bg-bg-hover rounded"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="text-text-secondary hover:text-text-primary transition-colors">
                  Sign In
                </Link>
                <Link to={ROUTES.REGISTER} className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
