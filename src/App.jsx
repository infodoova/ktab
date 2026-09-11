import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./core/routes/routes";
import GuestGuard from "./core/guards/GuestGuard";
import RoleGuard from "./core/guards/RoleGuard";
import {
  ErrorBoundary,
  RouteErrorBoundary,
  RouteLoadingFallback,
} from "./components/common";

/**
 * Wraps route component with appropriate guard or redirect based on route config,
 * encapsulates it in a RouteErrorBoundary that resets on navigation,
 * and handles lazy loading via Suspense.
 */
function renderRouteElement(route) {
  const Component = route.component;

  if (route.redirect) {
    return <Navigate to={route.redirect} replace />;
  }

  if (!Component) return null;

  let content;
  if (route.guard === "guest") {
    content = (
      <GuestGuard>
        <Component />
      </GuestGuard>
    );
  } else if (route.guard === "role") {
    content = (
      <RoleGuard allowedRoles={route.roles || []}>
        <Component />
      </RoleGuard>
    );
  } else {
    content = <Component />;
  }

  return (
    <RouteErrorBoundary title={route.name ? `خطأ في صفحة ${route.name}` : undefined}>
      <Suspense fallback={<RouteLoadingFallback />}>
        {content}
      </Suspense>
    </RouteErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary variant="page">
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={route.path || index}
            path={route.path}
            element={renderRouteElement(route)}
          />
        ))}
      </Routes>
    </ErrorBoundary>
  );
}

export default App;


