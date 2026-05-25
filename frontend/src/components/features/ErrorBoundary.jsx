import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log error to an error reporting service here (e.g., Sentry)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4 text-accent-danger">Something went wrong.</h2>
          <p className="text-text-secondary mb-8 max-w-md">
            We apologize for the inconvenience. Our team has been notified.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left bg-bg-elevated p-4 rounded-lg w-full max-w-4xl overflow-auto text-sm font-mono text-accent-danger border border-border-subtle">
              <summary className="cursor-pointer mb-2">Error Details (Dev Only)</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
