import {
  LayoutDashboard,
  FolderOpen,
  Library as LibraryIcon,
  Star,
  Sparkles,
  Settings,
} from "lucide-react";

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
    name: "AuthorMyBooks",
    label: "مكتبتي الخاصة",
    icon: LibraryIcon,
    path: "/author/my-books",
  },
    {
    name: "AuthorMyStories",
    label: "قصصي التفاعلية",
    icon: FolderOpen,
    path: "/author/my-stories",
  },
  {
    name: "AuthorRatings",
    label: "التقييمات والمراجعات",
    icon: Star,
    path: "/author/ratings",
  },
  // {
  //   name: "AuthorAITools",
  //   label: "أدوات الذكاء الاصطناعي",
  //   icon: Sparkles,
  //   path: "/author/ai-tools",
  // },
  // {
  //   name: "AuthorSettings",
  //   label: "الإعدادات",
  //   icon: Settings,
  //   path: "/author/settings",
  // },
];

export default AUTHOR_NAV_ITEMS;
