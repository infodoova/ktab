import { lazy } from "react";
import { ROLES, ROLE_CODES } from "@/core/constants/roles";

const AdminLibraryView = lazy(() =>
  import("../../../features/Admin/libraryManagement/views/AdminLibraryView")
);
const AdminLibraryCreateView = lazy(() =>
  import("../../../features/Admin/libraryManagement/views/AdminLibraryCreateView")
);
const AdminPublisherView = lazy(() =>
  import("../../../features/Admin/publisherManagement/views/AdminPublisherView")
);
const AdminPublisherCreateView = lazy(() =>
  import("../../../features/Admin/publisherManagement/views/AdminPublisherCreateView")
);

/**
 * Admin Feature Routes Definition (00 / ADMIN)
 * Strictly protected by RoleGuard: accessible only to users with role "00" or "ADMIN".
 */
export const adminRoutes = [
  {
    name: "AdminDashboard",
    path: "/admin/dashboard",
    redirect: "/admin/library",
  },
  {
    name: "AdminLibrary",
    path: "/admin/library",
    component: AdminLibraryView,
    guard: "role",
    roles: [ROLES.ADMIN, ROLE_CODES.ADMIN],
  },
  {
    name: "AdminLibraryCreate",
    path: "/admin/library/create",
    component: AdminLibraryCreateView,
    guard: "role",
    roles: [ROLES.ADMIN, ROLE_CODES.ADMIN],
  },
  {
    name: "AdminPublishers",
    path: "/admin/publishers",
    component: AdminPublisherView,
    guard: "role",
    roles: [ROLES.ADMIN, ROLE_CODES.ADMIN],
  },
  {
    name: "AdminPublisherCreate",
    path: "/admin/publishers/create",
    component: AdminPublisherCreateView,
    guard: "role",
    roles: [ROLES.ADMIN, ROLE_CODES.ADMIN],
  },
  {
    path: "/admin",
    redirect: "/admin/library",
  },
];

export default adminRoutes;
