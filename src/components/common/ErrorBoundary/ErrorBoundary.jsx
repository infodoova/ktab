import React, { Component } from "react";
import { RotateCcw, Home, ArrowRight, AlertCircle } from "lucide-react";
import "./ErrorBoundary.css";

/**
 * Application Error Boundary.
 * Catches JavaScript errors anywhere in child component tree and displays fallback UI.
 * - Suppresses technical stack traces from end-users in production.
 * - Supports visual variants: "page" (default), "card", "inline".
 * - Auto-recovers on route changes via resetKeys.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (typeof this.props.onError === "function") {
      this.props.onError(error, errorInfo);
    }
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys[index]
      );
      if (hasChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    if (typeof this.props.onReset === "function") {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const {
      children,
      fallback,
      variant = "page",
      title,
      message,
      showHomeButton = true,
      showBackButton = true,
      className = "",
    } = this.props;

    if (!hasError) {
      return children;
    }

    // Custom fallback support
    if (fallback) {
      if (typeof fallback === "function") {
        return fallback({
          error,
          errorInfo,
          resetError: this.resetErrorBoundary,
        });
      }
      return fallback;
    }

    // 1. Inline Variant (compact banner)
    if (variant === "inline") {
      return (
        <div dir="rtl" className={`myui-eb-inline ${className}`}>
          <div className="myui-eb-inline-content">
            <AlertCircle size={16} className="myui-eb-inline-icon" />
            <span className="myui-eb-inline-text">
              {message || "تعذر إكمال هذه العملية مؤقتاً."}
            </span>
          </div>
          <button
            type="button"
            onClick={this.resetErrorBoundary}
            className="myui-eb-inline-btn"
          >
            <RotateCcw size={13} />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      );
    }

    // 2. Card / Section Variant
    if (variant === "card") {
      return (
        <div dir="rtl" className={`myui-eb-card ${className}`}>
          <div className="myui-eb-emblem" aria-hidden="true">
            <AlertCircle size={24} />
          </div>

          <h3 className="myui-eb-card-title">
            {title || "تعذر عرض هذا القسم"}
          </h3>

          <p className="myui-eb-card-desc">
            {message ||
              "حدث خطأ غير متوقع أثناء تحميل البيانات. يمكنك محاولة التحديث مجدداً."}
          </p>

          <div className="myui-eb-actions">
            <button
              type="button"
              onClick={this.resetErrorBoundary}
              className="myui-eb-btn-primary"
            >
              <RotateCcw size={15} />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </div>
      );
    }

    // 3. Default Page / Fullscreen Variant (Apple Editorial)
    return (
      <main dir="rtl" className={`myui-eb-page ${className}`}>
        <div className="myui-eb-card-container">
          {/* Subtle Apple Emblem */}
          <div className="myui-eb-emblem" aria-hidden="true">
            <AlertCircle size={28} />
          </div>

          {/* User-Facing Heading */}
          <h1 className="myui-eb-title">
            {title || "تعذر تحميل هذه الصفحة"}
          </h1>

          {/* Polite, clear explanation (zero code technical clutter) */}
          <p className="myui-eb-desc">
            {message ||
              "نواجه صعوبة مؤقتة في معالجة هذا الطلب. يمكنك محاولة إعادة التحميل الآن أو العودة للصفحة السابقة."}
          </p>

          {/* Responsive Action Buttons */}
          <div className="myui-eb-actions">
            <button
              type="button"
              onClick={this.resetErrorBoundary}
              className="myui-eb-btn-primary"
            >
              <RotateCcw size={15} />
              <span>إعادة المحاولة</span>
            </button>

            {showHomeButton && (
              <a href="/" className="myui-eb-btn-secondary">
                <Home size={15} />
                <span>الرئيسية</span>
              </a>
            )}

            {showBackButton &&
              typeof window !== "undefined" &&
              window.history.length > 1 && (
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="myui-eb-btn-secondary"
                >
                  <ArrowRight size={15} />
                  <span>الرجوع للخلف</span>
                </button>
              )}
          </div>
        </div>
      </main>
    );
  }
}

/**
 * Higher-Order Component to wrap any component in an ErrorBoundary
 */
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  WrappedComponent.displayName = `WithErrorBoundary(${
    Component.displayName || Component.name || "Component"
  })`;
  return WrappedComponent;
}

/**
 * Custom hook to imperatively trigger an error boundary from event handlers or async callbacks
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState(null);
  if (error != null) throw error;
  return { showBoundary: setError };
}

export default ErrorBoundary;
