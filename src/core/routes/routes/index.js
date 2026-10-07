import { lazy } from "react";
import { publicRoutes } from "./publicRoutes";
import { authorRoutes } from "./authorRoutes";
import { readerRoutes } from "./readerRoutes";
import { adminRoutes } from "./adminRoutes";
import { libraryAdminRoutes } from "./libraryAdminRoutes";
import { librarianRoutes } from "./librarianRoutes";
import { publisherRoutes } from "./publisherRoutes";

import { trailerRoutes } from "./trailerRoutes";

const NotFoundView = lazy(() => import("../../../features/common/views/NotFoundView"));

export { publicRoutes } from "./publicRoutes";
export { authorRoutes } from "./authorRoutes";
export { readerRoutes } from "./readerRoutes";
export { adminRoutes } from "./adminRoutes";
export { libraryAdminRoutes } from "./libraryAdminRoutes";
export { librarianRoutes } from "./librarianRoutes";
export { publisherRoutes } from "./publisherRoutes";

/**
 * Pure Route Definition List assembled from modular role route files.
 * Format: { name, path, component, guard, roles, redirect }
 */
export const routes = [
  ...publicRoutes,
  ...authorRoutes,
  ...readerRoutes,
  ...adminRoutes,
  ...libraryAdminRoutes,
  ...librarianRoutes,
  ...publisherRoutes,
  ...trailerRoutes,

  // 404 Catch-All
  {
    name: "NotFound",
    path: "*",
    component: NotFoundView,
  },
];

export default routes;
