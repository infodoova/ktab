import { lazy } from "react";
import { ROLES, ROLE_CODES } from "@/core/constants/roles";

const LibrarianDashboardView = lazy(() =>
  import("../../../features/Librarian/dashboard/views/LibrarianDashboardView")
);
const LibrarianLibraryView = lazy(() =>
  import("../../../features/Librarian/libraryManagement/views/LibrarianLibraryView")
);

/**
 * Librarian Feature Routes Definition (30 / LIBRARIAN)
 * Strictly protected by RoleGuard: accessible only to users with role "30" or "LIBRARIAN".
 */
export const librarianRoutes = [
  {
    name: "LibrarianDashboard",
    path: "/librarian/dashboard",
    component: LibrarianDashboardView,
    guard: "role",
    roles: [ROLES.LIBRARIAN, ROLE_CODES.LIBRARIAN],
  },
  {
    name: "LibrarianLibrary",
    path: "/librarian/library-management",
    component: LibrarianLibraryView,
    guard: "role",
    roles: [ROLES.LIBRARIAN, ROLE_CODES.LIBRARIAN],
  },
  {
    path: "/librarian",
    redirect: "/librarian/dashboard",
  },
];

export default librarianRoutes;
