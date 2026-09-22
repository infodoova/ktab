import { LayoutDashboard, BookOpen, Users } from "lucide-react";

/**
 * Global Navigation Definitions for Admin Role (00 / ADMIN)
 * 1. Dashboard (لوحة التحكم)
 * 2. Library Management (إدارة المكتبات)
 * 3. Publisher Management (إدارة الناشرين)
 */
export const ADMIN_NAV_ITEMS = [
  {
    name: "AdminDashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    name: "AdminLibrary",
    label: "إدارة المكتبات",
    icon: BookOpen,
    path: "/admin/library",
  },
  {
    name: "AdminPublishers",
    label: "إدارة الناشرين",
    icon: Users,
    path: "/admin/publishers",
  },
];

export default ADMIN_NAV_ITEMS;
