import { lazy } from "react";

// Feature: Reader Views
const ReaderDashboardView = lazy(() =>
  import("../../../features/reader/dashboard/views/ReaderDashboardView")
);
const LibraryView = lazy(() =>
  import("../../../features/reader/library/views/LibraryView")
);
const BookDetailsView = lazy(() =>
  import("../../../features/reader/book-details/views/BookDetailsView")
);
const BookDisplayView = lazy(() =>
  import("../../../features/reader/book-reader/views/BookDisplayView")
);
const InteractiveStoriesView = lazy(() =>
  import("../../../features/reader/interactive-stories/views/InteractiveStoriesView")
);
const InteractivePlayView = lazy(() =>
  import("../../../features/reader/interactive-play/views/InteractivePlayView")
);
const AchievementsView = lazy(() =>
  import("../../../features/reader/achievements/views/AchievementsView")
);
const ReaderProfileView = lazy(() =>
  import("../../../features/reader/profile/views/ReaderProfileView")
);
const ReaderSettingsView = lazy(() =>
  import("../../../features/reader/settings/views/ReaderSettingsView")
);
const BookImageLibraryView = lazy(() =>
  import("../../../features/reader/image-library/views/BookImageLibraryView")
);
const StoryBooksView = lazy(() =>
  import("../../../features/reader/story-books/views/StoryBooksView")
);
const NewStoryBookView = lazy(() =>
  import("../../../features/reader/story-books/views/NewStoryBookView")
);
const FlipboardStoryReaderView = lazy(() =>
  import("../../../features/reader/story-books/views/FlipboardStoryReaderView")
);

/**
 * Reader Role Protected Routes
 */
export const readerRoutes = [
  {
    name: "ReaderHome",
    path: "/reader/home",
    component: ReaderDashboardView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderBookDetails",
    path: "/reader/BookDetails/:id",
    component: BookDetailsView,
  },
  {
    name: "ReaderBookDisplay",
    path: "/reader/display/:id",
    component: BookDisplayView,
    guard: "role",
    roles: ["READER", "AUTHOR", "LIBRARIAN", "LIBRARY_ADMIN", "PUBLISHER", "ADMIN"],
  },
  {
    name: "ReaderAchievements",
    path: "/reader/Achievements",
    component: AchievementsView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderInteractiveStories",
    path: "/reader/interactive-stories",
    component: InteractiveStoriesView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderInteractivePlay",
    path: "/reader/interactive-stories/play",
    component: InteractivePlayView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderStoryBooks",
    path: "/reader/story-books",
    component: StoryBooksView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderStoryBookSingle",
    path: "/reader/story-book",
    component: StoryBooksView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderNewStoryBook",
    path: "/reader/story-books/new",
    component: NewStoryBookView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderNewStoryBookSingle",
    path: "/reader/story-book/new",
    component: NewStoryBookView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderFlipboardStoryReader",
    path: "/reader/story-books/read/:id",
    component: FlipboardStoryReaderView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderStoryReaderAlias",
    path: "/reader/story-reader/:id",
    component: FlipboardStoryReaderView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderProfile",
    path: "/reader/profile",
    component: ReaderProfileView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderLibrary",
    path: "/reader/library",
    component: LibraryView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderImageLibrary",
    path: "/reader/image-library",
    component: BookImageLibraryView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderBookImageLibrary",
    path: "/reader/book-image-library",
    component: BookImageLibraryView,
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderSettings",
    path: "/reader/settings",
    component: ReaderSettingsView,
    guard: "role",
    roles: ["READER"],
  },
  // Legacy Reader Redirects
  {
    path: "/Screens/dashboard/ReaderPages/MainPage",
    redirect: "/reader/home",
  },
  {
    path: "/Screens/dashboard/ReaderPages/Achievements",
    redirect: "/reader/Achievements",
  },
  {
    path: "/Screens/dashboard/ReaderPages/BookDetails/:id",
    redirect: "/reader/BookDetails/:id",
  },
  {
    path: "/Screens/dashboard/ReaderPages/BookDisplayPage/:id",
    redirect: "/reader/display/:id",
  },
  {
    path: "/Screens/dashboard/ReaderPages/InteractiveStories",
    redirect: "/reader/interactive-stories",
  },
  {
    path: "/Screens/dashboard/ReaderPages/Profile",
    redirect: "/reader/profile",
  },
  {
    path: "/Screens/dashboard/ReaderPages/library",
    redirect: "/reader/library",
  },
  {
    path: "/Screens/dashboard/ReaderPages/Settings",
    redirect: "/reader/settings",
  },
  // Legacy Error Redirect
  {
    path: "/Screens/roleError",
    redirect: "/role-error",
  },
];

export default readerRoutes;
