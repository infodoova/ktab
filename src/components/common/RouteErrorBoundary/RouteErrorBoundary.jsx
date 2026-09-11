import React from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "../ErrorBoundary";
import "./RouteErrorBoundary.css";

/**
 * Route-level Error Boundary wrapper that automatically resets
 * when the user navigates to a different route.
 */
export function RouteErrorBoundary({
  children,
  variant = "page",
  title,
  message,
  onError,
  fallback,
  className = "",
  ...props
}) {
  const location = useLocation();

  return (
    <div className={`route-error-boundary-wrap ${className}`}>
      <ErrorBoundary
        key={location.pathname}
        resetKeys={[location.pathname, location.search, location.key]}
        variant={variant}
        title={title}
        message={message}
        onError={onError}
        fallback={fallback}
        {...props}
      >
        {children}
      </ErrorBoundary>
    </div>
  );
}

export default RouteErrorBoundary;
