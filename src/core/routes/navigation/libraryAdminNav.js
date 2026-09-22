import { LayoutDashboard, BookOpen } from "lucide-react";

/**
 * Global Navigation Definitions for LibraryAdmin Role (35 / LIBRARY_ADMIN)
 * 1. Dashboard (لوحة التحكم)
 * 2. Library Management (إدارة المكتبة)
 */
export const LIBRARY_ADMIN_NAV_ITEMS = [
  {
    name: "LibraryAdminDashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/library-admin/dashboard",
  },
  {
    name: "LibraryAdminLibrary",
    label: "إدارة المكتبة",
    icon: BookOpen,
    path: "/library-admin/library-management",
  },
];

export default LIBRARY_ADMIN_NAV_ITEMS;
