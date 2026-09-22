import { ROLES, normalizeRole } from "@/core/constants/roles";
import { ADMIN_NAV_ITEMS } from "./adminNav";
import { LIBRARY_ADMIN_NAV_ITEMS } from "./libraryAdminNav";
import { LIBRARIAN_NAV_ITEMS } from "./librarianNav";
import { PUBLISHER_NAV_ITEMS } from "./publisherNav";
import { AUTHOR_NAV_ITEMS } from "./authorNav";
import { READER_NAV_ITEMS } from "./readerNav";

export { ADMIN_NAV_ITEMS } from "./adminNav";
export { LIBRARY_ADMIN_NAV_ITEMS } from "./libraryAdminNav";
export { LIBRARIAN_NAV_ITEMS } from "./librarianNav";
export { PUBLISHER_NAV_ITEMS } from "./publisherNav";
export { AUTHOR_NAV_ITEMS } from "./authorNav";
export { READER_NAV_ITEMS } from "./readerNav";

/**
 * Returns navigation items array corresponding to the authenticated user's role.
 *
 * @param {string|number} role
 * @returns {Array<{ name: string, label: string, icon: any, path: string }>}
 */
export function getNavItemsByRole(role) {
  const normalized = normalizeRole(role);
  if (normalized === ROLES.ADMIN) return ADMIN_NAV_ITEMS;
  if (normalized === ROLES.LIBRARY_ADMIN) return LIBRARY_ADMIN_NAV_ITEMS;
  if (normalized === ROLES.LIBRARIAN) return LIBRARIAN_NAV_ITEMS;
  if (normalized === ROLES.PUBLISHER) return PUBLISHER_NAV_ITEMS;
  if (normalized === ROLES.AUTHOR) return AUTHOR_NAV_ITEMS;
  return READER_NAV_ITEMS;
}

export default getNavItemsByRole;
