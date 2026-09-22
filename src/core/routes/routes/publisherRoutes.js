import { lazy } from "react";
import { ROLES, ROLE_CODES } from "@/core/constants/roles";

const PublisherDashboardView = lazy(() =>
  import("../../../features/publisher/dashboard/views/PublisherDashboardView")
);
const PublisherLibraryView = lazy(() =>
  import("../../../features/publisher/libraryManagement/views/PublisherLibraryView")
);

/**
 * Publisher Feature Routes Definition (40 / PUBLISHER)
 * Strictly protected by RoleGuard: accessible only to users with role "40" or "PUBLISHER".
 */
export const publisherRoutes = [
  {
    name: "PublisherDashboard",
    path: "/publisher/dashboard",
    component: PublisherDashboardView,
    guard: "role",
    roles: [ROLES.PUBLISHER, ROLE_CODES.PUBLISHER],
  },
  {
    name: "PublisherLibrary",
    path: "/publisher/library-management",
    component: PublisherLibraryView,
    guard: "role",
    roles: [ROLES.PUBLISHER, ROLE_CODES.PUBLISHER],
  },
  {
    path: "/publisher",
    redirect: "/publisher/dashboard",
  },
];

export default publisherRoutes;
