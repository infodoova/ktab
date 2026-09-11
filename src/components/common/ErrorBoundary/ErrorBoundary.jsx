import React, { Component } from "react";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ShieldAlert,
  Bug,
} from "lucide-react";
import "./ErrorBoundary.css";

/**
 * Enterprise-grade Error Boundary in Apple Light Mode (Zero Tailwind).
 * Supports visual variants: "fullscreen", "page", "card", "inline"
 * Auto-recovers on key changes (e.g. route transitions)
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsOpen: false,
      isCopied: false,
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
      isDetailsOpen: false,
      isCopied: false,
    });
  };

  handleCopyDetails = () => {
    const { error, errorInfo } = this.state;
    const details = `[Error]: ${error?.toString()}\n\n[Component Stack]: ${
      errorInfo?.componentStack || "N/A"
    }`;

    navigator.clipboard.writeText(details).then(() => {
      this.setState({ isCopied: true });
      setTimeout(() => {
        this.setState({ isCopied: false });
      }, 2500);
    });
  };

  render() {
    const { hasError, error, errorInfo, isDetailsOpen, isCopied } = this.state;
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

    // Inline Variant (compact banner)
    if (variant === "inline") {
      return (
        <div dir="rtl" className={`myui-eb-inline ${className}`}>
          <div className="myui-eb-inline-msg">
            <AlertTriangle size={16} />
            <span>
              {message || error?.message || "حدث خطأ غير متوقع في هذا الجزء."}
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

    // Card / Section Variant
    if (variant === "card") {
      return (
        <div dir="rtl" className={`myui-eb-card ${className}`}>
          <div className="myui-eb-card-icon-wrap">
            <ShieldAlert size={28} />
          </div>

          <h3 className="myui-eb-card-title">
            {title || "تعذر عرض هذا القسم"}
          </h3>

          <p className="myui-eb-card-desc">
            {message || "حدث خطأ غير متوقع أثناء تحميل هذه البيانات. يمكنك المحاولة مرة أخرى."}
          </p>

          <div className="myui-eb-card-actions">
            <button
              type="button"
              onClick={this.resetErrorBoundary}
              className="myui-eb-btn-primary"
            >
              <RotateCcw size={14} />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </div>
      );
    }

    // Default Fullscreen / Page Variant
    return (
      <div dir="rtl" className={`myui-eb-page ${className}`}>
        <div className="myui-eb-page-card">
          <div className="myui-eb-page-icon-wrap">
            <ShieldAlert size={36} />
          </div>

          <h1 className="myui-eb-page-title">
            {title || "عذراً، حدث خطأ غير متوقع"}
          </h1>

          <p className="myui-eb-page-desc">
            {message ||
              "واجه التطبيق مشكلة تقنية غير متوقعة أثناء معالجة هذا الطلب. نعتذر عن الإزعاج، يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية."}
          </p>

          <div className="myui-eb-page-actions">
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

            {showBackButton && typeof window !== "undefined" && window.history.length > 1 && (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="myui-eb-btn-secondary"
              >
                <span>الرجوع للخلف</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>

          {/* Diagnostic Error Details */}
          <div>
            <button
              type="button"
              onClick={() =>
                this.setState((prev) => ({
                  isDetailsOpen: !prev.isDetailsOpen,
                }))
              }
              className="myui-eb-details-toggle"
            >
              <Bug size={13} />
              <span>
                {isDetailsOpen ? "إخفاء التفاصيل التقنية" : "عرض التفاصيل التقنية للخطأ"}
              </span>
              {isDetailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isDetailsOpen && (
              <div className="myui-eb-stack-box" dir="ltr">
                <div className="myui-eb-stack-header">
                  <span style={{ color: "#64748b" }}>Error Stack</span>
                  <button
                    type="button"
                    onClick={this.handleCopyDetails}
                    className="myui-eb-copy-btn"
                  >
                    {isCopied ? (
                      <>
                        <Check size={11} color="#10b981" />
                        <span style={{ color: "#10b981" }}>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
                <p style={{ fontWeight: "bold", margin: "0 0 6px" }}>{error?.toString()}</p>
                {errorInfo?.componentStack && (
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#64748b" }}>
                    {errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
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
