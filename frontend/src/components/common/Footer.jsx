import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const Footer = () => {
  return (
    <footer className="bg-bg-secondary border-t border-border-subtle pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to={ROUTES.HOME} className="text-2xl font-display font-bold tracking-tighter mb-4 block">
              B<span className="text-accent-highlight">.</span>
            </Link>
            <p className="text-text-secondary max-w-sm mt-4 font-editorial">
              A platform for human-crafted stories, ideas, and perspectives. Designed for readability.
            </p>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4 text-text-primary">Platform</h3>
            <ul className="space-y-3">
              <li><Link to={ROUTES.HOME} className="text-text-secondary hover:text-accent-highlight transition-colors">Home</Link></li>
              <li><Link to={ROUTES.BLOG} className="text-text-secondary hover:text-accent-highlight transition-colors">Read</Link></li>
              <li><Link to={ROUTES.ABOUT} className="text-text-secondary hover:text-accent-highlight transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-text-primary">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-text-secondary hover:text-accent-highlight transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-text-secondary hover:text-accent-highlight transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-tertiary text-sm">
            © {new Date().getFullYear()} BlogPlatform. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Social Icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
