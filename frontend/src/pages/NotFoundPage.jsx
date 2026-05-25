import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-text-tertiary mb-6">404</h1>
        <h2 className="text-2xl font-display font-semibold mb-4">Page not found</h2>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary px-8 py-3">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
