import { BookOpen } from "lucide-react";

/**
 * Global Navigation Definitions for Publisher Role (40 / PUBLISHER)
 * 1. Editorial Review Queue (قائمة المراجعة والتحكيم)
 */
export const PUBLISHER_NAV_ITEMS = [
  {
    name: "PublisherLibrary",
    label: "قائمة المراجعة والتحكيم",
    icon: BookOpen,
    path: "/publisher/library-management",
  },
];

export default PUBLISHER_NAV_ITEMS;
