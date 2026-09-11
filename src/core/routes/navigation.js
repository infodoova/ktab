import {
  SquareLibrary,
  BookOpen,
  FolderOpen,
  ArchiveIcon,
  Settings,
  LayoutDashboard,
  Sparkles,
  Layers,
  PlusCircle,
  Star,
  Library as LibraryIcon,
} from "lucide-react";

/**
 * Global Navigation Definitions for Reader Role
 */
export const READER_NAV_ITEMS = [
  {
    name: "ReaderHome",
    label: "الصفحة الرئيسية",
    icon: SquareLibrary,
    path: "/reader/home",
  },
  {
    name: "ReaderLibrary",
    label: "المكتبة",
    icon: BookOpen,
    path: "/reader/library",
  },
  {
    name: "ReaderInteractiveStories",
    label: "القصص التفاعلية",
    icon: FolderOpen,
    path: "/reader/interactive-stories",
  },
  {
    name: "ReaderAchievements",
    label: "الإنجازات والشارات",
    icon: ArchiveIcon,
    path: "/reader/Achievements",
  },
  {
    name: "ReaderSettings",
    label: "الإعدادات",
    icon: Settings,
    path: "/reader/settings",
  },
];

/**
 * Global Navigation Definitions for Author Role
 */
export const AUTHOR_NAV_ITEMS = [
  {
    name: "AuthorControl",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/author/control",
  },
  {
    name: "AuthorInteractiveStory",
    label: "قصة تفاعلية جديدة",
    icon: Layers,
    path: "/author/interactive-story",
  },
  {
    name: "AuthorMyStories",
    label: "قصصي التفاعلية",
    icon: FolderOpen,
    path: "/author/my-stories",
  },
  {
    name: "AuthorNewBook",
    label: "نشر كتاب جديد",
    icon: PlusCircle,
    path: "/author/new-book",
  },
  {
    name: "AuthorMyBooks",
    label: "مكتبتي الخاصة",
    icon: LibraryIcon,
    path: "/author/my-books",
  },
  {
    name: "AuthorRatings",
    label: "التقييمات والمراجعات",
    icon: Star,
    path: "/author/ratings",
  },
  {
    name: "AuthorAITools",
    label: "أدوات الذكاء الاصطناعي",
    icon: Sparkles,
    path: "/author/ai-tools",
  },
  {
    name: "AuthorSettings",
    label: "الإعدادات",
    icon: Settings,
    path: "/author/settings",
  },
];

/**
 * Returns navigation items for a given user role.
 *
 * @param {"READER" | "AUTHOR" | string} role
 * @returns {Array<{ name: string, label: string, icon: any, path: string }>}
 */
export function getNavItemsByRole(role) {
  if (role === "AUTHOR") return AUTHOR_NAV_ITEMS;
  return READER_NAV_ITEMS;
}
