import {
  Home,
  BookOpen,
  ScrollText,
  BookMarked,
  ArchiveIcon,
  Settings,
} from "lucide-react";

/**
 * Global Navigation Definitions for Reader Role
 */
export const READER_NAV_ITEMS = [
  {
    name: "ReaderHome",
    label: "الصفحة الرئيسية",
    icon: Home,
    path: "/reader/home",
  },
  {
    name: "ReaderLibrary",
    label: "المكتبة",
    icon: BookOpen,
    path: "/reader/library",
    subItems: [
      {
        name: "ReaderCatalog",
        label: " الكتب",
        path: "/reader/library",
      },
      {
        name: "ReaderImageLibrary",
        label: "معرض الصور",
        path: "/reader/image-library",
      },
    ],
  },
  {
    name: "ReaderInteractiveStories",
    label: "القصص التفاعلية",
    icon: ScrollText,
    path: "/reader/interactive-stories",
  },
  {
    name: "ReaderStoryBooks",
    label: "قصص الأطفال",
    icon: BookMarked,
    path: "/reader/story-books",
  },
  // {
  //   name: "ReaderAchievements",
  //   label: "الإنجازات والشارات",
  //   icon: ArchiveIcon,
  //   path: "/reader/Achievements",
  // },
  // {
  //   name: "ReaderSettings",
  //   label: "الإعدادات",
  //   icon: Settings,
  //   path: "/reader/settings",
  // },
];

export default READER_NAV_ITEMS;
