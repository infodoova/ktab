import { lazy } from "react";
import { ROLES, ROLE_CODES } from "@/core/constants/roles";

const LibrarianBooksView = lazy(() =>
  import("../../../features/Librarian/bookManagement/views/LibrarianBooksView")
);
const LibrarianBookCreateView = lazy(() =>
  import("../../../features/Librarian/bookManagement/views/LibrarianBookCreateView")
);

/**
 * Librarian Feature Routes Definition (30 / LIBRARIAN)
 * Strictly protected by RoleGuard: accessible only to users with role "30" or "LIBRARIAN".
 */
export const librarianRoutes = [
  {
    name: "LibrarianBooks",
    path: "/librarian/books",
    component: LibrarianBooksView,
    guard: "role",
    roles: [ROLES.LIBRARIAN, ROLE_CODES.LIBRARIAN],
  },
  {
    name: "LibrarianBookCreate",
    path: "/librarian/books/create",
    component: LibrarianBookCreateView,
    guard: "role",
    roles: [ROLES.LIBRARIAN, ROLE_CODES.LIBRARIAN],
  },
  {
    name: "LibrarianBookEdit",
    path: "/librarian/books/:id/edit",
    component: LibrarianBookCreateView,
    guard: "role",
    roles: [ROLES.LIBRARIAN, ROLE_CODES.LIBRARIAN],
  },

  {
    name: "LibrarianManageBooks",
    path: "/librarian/manage-books",
    redirect: "/librarian/books",
  },
  {
    path: "/librarian",
    redirect: "/librarian/books",
  },
  {
    path: "/librarian/dashboard",
    redirect: "/librarian/books",
  },
  {
    path: "/librarian/library-management",
    redirect: "/librarian/books",
  },
];

export default librarianRoutes;
