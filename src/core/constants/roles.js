/**
 * Global Role Definitions & Code Mappings.
 * Centralized constant source for all role authorization, navigation, and redirection.
 */

export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  AUTHOR: "AUTHOR",
  READER: "READER",
  LIBRARIAN: "LIBRARIAN",
  LIBRARY_ADMIN: "LIBRARY_ADMIN",
  PUBLISHER: "PUBLISHER",
});

export const ROLE_CODES = Object.freeze({
  ADMIN: "00",
  AUTHOR: "10",
  READER: "20",
  LIBRARIAN: "30",
  LIBRARY_ADMIN: "35",
  PUBLISHER: "40",
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.ADMIN]: "مشرف عام",
  [ROLES.LIBRARY_ADMIN]: "مشرف مكتبة",
  [ROLES.LIBRARIAN]: "أمين مكتبة",
  [ROLES.PUBLISHER]: "ناشر",
  [ROLES.AUTHOR]: "مؤلف",
  [ROLES.READER]: "قارئ",
});

export const ROLE_DEFAULT_ROUTES = Object.freeze({
  [ROLES.ADMIN]: "/admin/library",
  [ROLES.LIBRARY_ADMIN]: "/library-admin/library-management",
  [ROLES.LIBRARIAN]: "/librarian/dashboard",
  [ROLES.PUBLISHER]: "/publisher/library-management",
  [ROLES.AUTHOR]: "/author/control",
  [ROLES.READER]: "/reader/home",
});

/**
 * Normalizes any role representation (numeric code or string name) to standard uppercase enum.
 *
 * @param {string|number} role
 * @returns {string|null}
 */
export function normalizeRole(role) {
  if (role === null || role === undefined || role === "") return null;
  const str = String(role).trim().toUpperCase();
  if (str === "00" || str === "0" || str === "ADMIN") return ROLES.ADMIN;
  if (str === "10" || str === "AUTHOR") return ROLES.AUTHOR;
  if (str === "20" || str === "READER") return ROLES.READER;
  if (str === "30" || str === "LIBRARIAN") return ROLES.LIBRARIAN;
  if (str === "35" || str === "LIBRARY_ADMIN" || str === "LIBRARYADMIN" || str === "ADMIN_LIBRARIAN") return ROLES.LIBRARY_ADMIN;
  if (str === "40" || str === "PUBLISHER") return ROLES.PUBLISHER;
  return str;
}

/**
 * Checks whether userRole satisfies any of the required allowedRoles.
 *
 * @param {string|number} userRole
 * @param {Array<string|number>} allowedRoles
 * @returns {boolean}
 */
export function isRoleAuthorized(userRole, allowedRoles = []) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRole) return false;
  const normalizedUserRole = normalizeRole(userRole);
  return allowedRoles.some((allowed) => normalizeRole(allowed) === normalizedUserRole);
}

/**
 * Gets human-readable Arabic label for a given role.
 *
 * @param {string|number} role
 * @returns {string}
 */
export function getRoleLabel(role) {
  const normalized = normalizeRole(role);
  return ROLE_LABELS[normalized] || role || "";
}

/**
 * Resolves post-auth landing route according to user role.
 *
 * @param {string|number} role
 * @returns {string}
 */
export function getRoleDefaultRoute(role) {
  const normalized = normalizeRole(role);
  return ROLE_DEFAULT_ROUTES[normalized] || "/";
}
