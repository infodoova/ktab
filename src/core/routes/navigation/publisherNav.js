import { LayoutDashboard, BookOpen } from "lucide-react";

/**
 * Global Navigation Definitions for Publisher Role (40 / PUBLISHER)
 * 1. Dashboard (لوحة التحكم)
 * 2. Library / Publications Management (إدارة المنشورات)
 */
export const PUBLISHER_NAV_ITEMS = [
  {
    name: "PublisherDashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/publisher/dashboard",
  },
  {
    name: "PublisherLibrary",
    label: "إدارة المنشورات",
    icon: BookOpen,
    path: "/publisher/library-management",
  },
];

export default PUBLISHER_NAV_ITEMS;
