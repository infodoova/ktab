import { lazy } from "react";
import { ROLES, ROLE_CODES } from "@/core/constants/roles";

const PublisherLibraryView = lazy(() =>
  import("../../../features/publisher/libraryManagement/views/PublisherLibraryView")
);

/**
 * Publisher Feature Routes Definition (40 / PUBLISHER)
 * Strictly protected by RoleGuard: accessible only to users with role "40" or "PUBLISHER".
 */
export const publisherRoutes = [
  {
    name: "PublisherLibrary",
    path: "/publisher/library-management",
    component: PublisherLibraryView,
    guard: "role",
    roles: [ROLES.PUBLISHER, ROLE_CODES.PUBLISHER],
  },
  {
    path: "/publisher/dashboard",
    redirect: "/publisher/library-management",
  },
  {
    path: "/publisher",
    redirect: "/publisher/library-management",
  },
];

export default publisherRoutes;
