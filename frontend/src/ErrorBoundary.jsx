import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', info);

    // Redirect to 404 after logging
    if (typeof window !== 'undefined') {
      window.location.href = '/404';
    }
  }

  render() {
    if (this.state.hasError) {
      // Redirect to 404 page
      if (typeof window !== 'undefined') {
        window.location.href = '/404';
      }
      return null;
    }

    return this.props.children;
  }
}
