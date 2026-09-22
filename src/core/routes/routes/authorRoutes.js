import { lazy } from "react";

// Feature: Author Views
const AuthorDashboardView = lazy(() =>
  import("../../../features/author/dashboard/views/AuthorDashboardView")
);
const BookPublishView = lazy(() =>
  import("../../../features/author/book-publish/views/BookPublishView")
);
const MyBooksView = lazy(() =>
  import("../../../features/author/my-books/views/MyBooksView")
);
const MyStoriesView = lazy(() =>
  import("../../../features/author/interactive-stories/views/MyStoriesView")
);
const NewInteractiveStoryView = lazy(() =>
  import("../../../features/author/new-interactive-story/views/NewInteractiveStoryView")
);
const AiToolsView = lazy(() =>
  import("../../../features/author/ai-tools/views/AiToolsView")
);
const AuthorRatingsView = lazy(() =>
  import("../../../features/author/ratings/views/AuthorRatingsView")
);
const AuthorSettingsView = lazy(() =>
  import("../../../features/author/settings/views/AuthorSettingsView")
);

/**
 * Author Role Protected Routes
 */
export const authorRoutes = [
  {
    name: "AuthorControl",
    path: "/author/control",
    component: AuthorDashboardView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorInteractiveStory",
    path: "/author/interactive-story",
    component: NewInteractiveStoryView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorMyStories",
    path: "/author/my-stories",
    component: MyStoriesView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorNewBook",
    path: "/author/new-book",
    component: BookPublishView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorEditBook",
    path: "/author/new-book/:draftId",
    component: BookPublishView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorEditBookAlt",
    path: "/author/books/edit/:draftId",
    component: BookPublishView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorSettings",
    path: "/author/settings",
    component: AuthorSettingsView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorRatings",
    path: "/author/ratings",
    component: AuthorRatingsView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorAITools",
    path: "/author/ai-tools",
    component: AiToolsView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  {
    name: "AuthorMyBooks",
    path: "/author/my-books",
    component: MyBooksView,
    guard: "role",
    roles: ["AUTHOR"],
  },
  // Legacy Author Redirects
  {
    path: "/Screens/dashboard/AuthorPages/controlBoard",
    redirect: "/author/control",
  },
  {
    path: "/Screens/dashboard/AuthorPages/newBookPublish",
    redirect: "/author/new-book",
  },
  {
    path: "/Screens/dashboard/AuthorPages/Settings",
    redirect: "/author/settings",
  },
  {
    path: "/Screens/dashboard/AuthorPages/ratings",
    redirect: "/author/ratings",
  },
  {
    path: "/Screens/dashboard/AuthorPages/NewInteractiveStory",
    redirect: "/author/interactive-story",
  },
  {
    path: "/Screens/dashboard/AuthorPages/mystories",
    redirect: "/author/my-stories",
  },
  {
    path: "/Screens/dashboard/AuthorPages/aiTools",
    redirect: "/author/ai-tools",
  },
  {
    path: "/Screens/dashboard/AuthorPages/myBooks",
    redirect: "/author/my-books",
  },
];

export default authorRoutes;
