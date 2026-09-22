import { LayoutDashboard, BookOpen } from "lucide-react";

/**
 * Global Navigation Definitions for Librarian Role (30 / LIBRARIAN)
 * 1. Dashboard (لوحة التحكم)
 * 2. Library Management (إدارة المكتبة)
 */
export const LIBRARIAN_NAV_ITEMS = [
  {
    name: "LibrarianDashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/librarian/dashboard",
  },
  {
    name: "LibrarianLibrary",
    label: "إدارة المكتبة",
    icon: BookOpen,
    path: "/librarian/library-management",
  },
];

export default LIBRARIAN_NAV_ITEMS;
