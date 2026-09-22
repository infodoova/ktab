import { LayoutDashboard, Building2, BookOpen, Users } from "lucide-react";

/**
 * Global Navigation Definitions for LibraryAdmin Role (35 / LIBRARY_ADMIN)
 * 1. Dashboard (لوحة التحكم)
 * 2. Library Management (إدارة المكتبة)
 * 3. Book Management (إدارة الكتب)
 * 4. Staff Management (فريق العمل)
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
    icon: Building2,
    path: "/library-admin/library-management",
  },
  {
    name: "LibraryAdminBooks",
    label: "إدارة الكتب",
    icon: BookOpen,
    path: "/library-admin/books",
  },
  {
    name: "LibraryAdminStaff",
    label: "فريق العمل",
    icon: Users,
    path: "/library-admin/staff",
  },
];

export default LIBRARY_ADMIN_NAV_ITEMS;
