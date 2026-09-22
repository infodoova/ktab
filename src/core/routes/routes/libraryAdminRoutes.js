import { lazy } from "react";
import { ROLES, ROLE_CODES } from "@/core/constants/roles";

const LibraryAdminDashboardView = lazy(() =>
  import("../../../features/LibraryAdmin/dashboard/views/LibraryAdminDashboardView")
);
const LibraryAdminLibraryView = lazy(() =>
  import("../../../features/LibraryAdmin/libraryManagement/views/LibraryAdminLibraryView")
);
const LibraryAdminStaffView = lazy(() =>
  import("../../../features/LibraryAdmin/staffManagement/views/LibraryAdminStaffView")
);
const LibraryAdminStaffCreateView = lazy(() =>
  import("../../../features/LibraryAdmin/staffManagement/views/LibraryAdminStaffCreateView")
);
const LibraryAdminBooksView = lazy(() =>
  import("../../../features/LibraryAdmin/bookManagement/views/LibraryAdminBooksView")
);

/**
 * LibraryAdmin Feature Routes Definition (35 / LIBRARY_ADMIN)
 * Strictly protected by RoleGuard: accessible only to users with role "35" or "LIBRARY_ADMIN".
 */
export const libraryAdminRoutes = [
  {
    name: "LibraryAdminDashboard",
    path: "/library-admin/dashboard",
    component: LibraryAdminDashboardView,
    guard: "role",
    roles: [ROLES.LIBRARY_ADMIN, ROLE_CODES.LIBRARY_ADMIN],
  },
  {
    name: "LibraryAdminLibrary",
    path: "/library-admin/library-management",
    component: LibraryAdminLibraryView,
    guard: "role",
    roles: [ROLES.LIBRARY_ADMIN, ROLE_CODES.LIBRARY_ADMIN],
  },
  {
    name: "LibraryAdminOrganization",
    path: "/library-admin/organization",
    redirect: "/library-admin/library-management",
  },
  {
    name: "LibraryAdminBooks",
    path: "/library-admin/books",
    component: LibraryAdminBooksView,
    guard: "role",
    roles: [ROLES.LIBRARY_ADMIN, ROLE_CODES.LIBRARY_ADMIN],
  },
  {
    name: "LibraryAdminBookManagement",
    path: "/library-admin/book-management",
    redirect: "/library-admin/books",
  },
  {
    name: "LibraryAdminStaff",
    path: "/library-admin/staff",
    component: LibraryAdminStaffView,
    guard: "role",
    roles: [ROLES.LIBRARY_ADMIN, ROLE_CODES.LIBRARY_ADMIN],
  },
  {
    name: "LibraryAdminStaffCreate",
    path: "/library-admin/staff/create",
    component: LibraryAdminStaffCreateView,
    guard: "role",
    roles: [ROLES.LIBRARY_ADMIN, ROLE_CODES.LIBRARY_ADMIN],
  },
  {
    path: "/library-admin",
    redirect: "/library-admin/dashboard",
  },
];

export default libraryAdminRoutes;
