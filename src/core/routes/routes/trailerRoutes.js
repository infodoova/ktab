import { lazy } from "react";
import { TRAILER_STUDIO_ROLES } from "@/features/trailers/utils/trailerUtils";
const TrailerStudioView = lazy(() => import("@/features/trailers/views/TrailerStudioView"));
export const trailerRoutes = [
  { name: "AuthorTrailers", path: "/author/trailers", component: TrailerStudioView, guard: "role", roles: ["AUTHOR"] },
  { name: "LibraryAdminTrailers", path: "/library-admin/trailers", component: TrailerStudioView, guard: "role", roles: ["LIBRARY_ADMIN"] },
  { name: "BookTrailers", path: "/trailers", component: TrailerStudioView, guard: "role", roles: TRAILER_STUDIO_ROLES },
  { path: "/admin/trailers", redirect: "/admin/library" },
  { path: "/librarian/trailers", redirect: "/librarian/books" },
  { path: "/trailer", redirect: "/trailers" },
  { path: "/trialer", redirect: "/trailers" },
];
