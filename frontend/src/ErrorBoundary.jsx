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
    // You can log the error to an external service here
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground p-8">
          <h1 className="text-2xl font-bold mb-4">Đã có lỗi</h1>
          <p>
            Có lỗi xảy ra khi hiển thị trang. Vui lòng thử tải lại trang hoặc
            kiểm tra console để biết chi tiết.
          </p>
          <pre className="mt-4 text-sm">{String(this.state.error)}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
