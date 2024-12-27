import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <h2>Oops! Something went wrong!</h2>
          <button onClick={() => window.location.reload()}>Try Again</button>
          <button onClick={() => window.location.href = '/'}>Go Home</button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
