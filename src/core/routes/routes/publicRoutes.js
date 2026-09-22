import { lazy } from "react";

// Feature: Home
const HomeView = lazy(() => import("../../../features/home/views/HomeView"));

// Feature: Common & Errors
const RoleErrorView = lazy(() => import("../../../features/common/views/RoleErrorView"));
const ShareRedirectView = lazy(() => import("../../../features/common/views/ShareRedirectView"));

// Feature: Auth
const LoginView = lazy(() => import("../../../features/auth/views/LoginView"));
const SignupView = lazy(() => import("../../../features/auth/views/SignupView"));

/**
 * Public & Guest Auth Routes Configuration
 */
export const publicRoutes = [
  // ==========================================
  // Public Routes
  // ==========================================
  {
    name: "Home",
    path: "/",
    component: HomeView,
  },
  {
    name: "RoleError",
    path: "/role-error",
    component: RoleErrorView,
  },
  {
    name: "Share",
    path: "/share",
    component: ShareRedirectView,
  },

  // ==========================================
  // Guest Routes (Auth)
  // ==========================================
  {
    name: "Login",
    path: "/login",
    component: LoginView,
    guard: "guest",
  },
  {
    name: "Signup",
    path: "/signup",
    component: SignupView,
    guard: "guest",
  },
  // Legacy Auth Redirects
  {
    path: "/Screens/auth/login",
    redirect: "/login",
  },
  {
    path: "/Screens/auth/signup",
    redirect: "/signup",
  },
];

export default publicRoutes;
