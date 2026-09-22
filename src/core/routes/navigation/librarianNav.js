import { BookOpen } from "lucide-react";

/**
 * Global Navigation Definitions for Librarian Role (30 / LIBRARIAN)
 * 1. Book Management (إدارة الكتب)
 */
export const LIBRARIAN_NAV_ITEMS = [
  {
    name: "LibrarianBooks",
    label: "إدارة الكتب",
    icon: BookOpen,
    path: "/librarian/books",
  },
];

export default LIBRARIAN_NAV_ITEMS;
