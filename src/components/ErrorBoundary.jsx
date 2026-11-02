import React from 'react';

/**
 * Route/app error boundary (see docs/PLAN.md §L4 resilience). Catches render
 * errors so a single failing view cannot blank the whole app.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" role="alert" style={{ padding: '32px' }}>
          <h2>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)' }}>{this.state.error?.message}</p>
          <button className="btn-secondary btn-sm" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
