import { lazy } from "react";

// Feature: Home & Marketing
const HomeView = lazy(() => import("../../../features/home/views/HomeView"));
const EarlyAccessView = lazy(() => import("../../../features/early-access/views/EarlyAccessView/EarlyAccessView"));
const FreeVoucherView = lazy(() => import("../../../features/free-voucher/views/FreeVoucherView/FreeVoucherView"));

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
    name: "EarlyAccess",
    path: "/early-access",
    component: EarlyAccessView,
  },
  {
    name: "EarlyAccessAdminLibrarian",
    path: "/early-access/admin-librarian",
    component: EarlyAccessView,
  },
  {
    name: "EarlyAccessReaderRedirect",
    path: "/early-access/reader",
    redirect: "/free-voucher?role=reader",
  },
  {
    name: "EarlyAccessAuthorRedirect",
    path: "/early-access/author",
    redirect: "/free-voucher?role=author",
  },
  {
    name: "FreeVoucher",
    path: "/free-voucher",
    component: FreeVoucherView,
  },
  {
    name: "FreeVoucherRole",
    path: "/free-voucher/:role",
    component: FreeVoucherView,
  },
  {
    name: "Voucher",
    path: "/voucher",
    component: FreeVoucherView,
  },
  {
    name: "VoucherRole",
    path: "/voucher/:role",
    component: FreeVoucherView,
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
