import { lazy } from "react";

// Feature: Home
const HomeView = lazy(() => import("../../features/home/views/HomeView"));

// Feature: Common & Errors
const NotFoundView = lazy(() => import("../../features/common/views/NotFoundView"));
const RoleErrorView = lazy(() => import("../../features/common/views/RoleErrorView"));
const ShareRedirectView = lazy(() => import("../../features/common/views/ShareRedirectView"));

// Feature: Auth
const LoginView = lazy(() => import("../../features/auth/views/LoginView"));
const SignupView = lazy(() => import("../../features/auth/views/SignupView"));

// Feature: Author
const AuthorDashboardView = lazy(() => import("../../features/author/dashboard/views/AuthorDashboardView"));
const BookPublishView = lazy(() => import("../../features/author/book-publish/views/BookPublishView"));
const MyBooksView = lazy(() => import("../../features/author/my-books/views/MyBooksView"));
const MyStoriesView = lazy(() => import("../../features/author/interactive-stories/views/MyStoriesView"));
const NewInteractiveStoryView = lazy(() => import("../../features/author/new-interactive-story/views/NewInteractiveStoryView"));
const AiToolsView = lazy(() => import("../../features/author/ai-tools/views/AiToolsView"));
const AuthorRatingsView = lazy(() => import("../../features/author/ratings/views/AuthorRatingsView"));
const AuthorSettingsView = lazy(() => import("../../features/author/settings/views/AuthorSettingsView"));

// Feature: Reader
const ReaderDashboardView = lazy(() => import("../../features/reader/dashboard/views/ReaderDashboardView"));
const LibraryView = lazy(() => import("../../features/reader/library/views/LibraryView"));
const BookDetailsView = lazy(() => import("../../features/reader/book-details/views/BookDetailsView"));
const BookDisplayView = lazy(() => import("../../features/reader/book-reader/views/BookDisplayView"));
const InteractiveStoriesView = lazy(() => import("../../features/reader/interactive-stories/views/InteractiveStoriesView"));
const InteractivePlayView = lazy(() => import("../../features/reader/interactive-stories/views/InteractivePlayView"));
const AchievementsView = lazy(() => import("../../features/reader/achievements/views/AchievementsView"));
const ReaderProfileView = lazy(() => import("../../features/reader/profile/views/ReaderProfileView"));
const ReaderSettingsView = lazy(() => import("../../features/reader/settings/views/ReaderSettingsView"));

export * from "./navigation";

/**
 * Pure Route Definition List
 * Format: { name, path, component, guard, roles, redirect }
 */
export const routes = [

  // ==========================================
  // Public Routes
  // ==========================================
  {
    name: "Home",
    path: "/",
    component: HomeView,
  },
  {
    name: "RoleError",
    path: "/role-error",
    component: RoleErrorView,
  },
  {
    name: "Share",
    path: "/share",
    component: ShareRedirectView,
  },

  // ==========================================
  // Guest Routes (Auth)
  // ==========================================
  {
    name: "Login",
    path: "/login",
    component: LoginView,
    guard: "guest",
  },
  {
    name: "Signup",
    path: "/signup",
    component: SignupView,
    guard: "guest",
  },
  // Legacy Auth Redirects
  {
    path: "/Screens/auth/login",
    redirect: "/login",
  },
  {
    path: "/Screens/auth/signup",
    redirect: "/signup",
  },

  // ==========================================
  // Author Routes (Protected: AUTHOR)
  // ==========================================
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

  // ==========================================
  // Reader Routes (Protected: READER)
  // ==========================================
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
    guard: "role",
    roles: ["READER"],
  },
  {
    name: "ReaderBookDisplay",
    path: "/reader/display/:id",
    component: BookDisplayView,
    guard: "role",
    roles: ["READER"],
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

  // 404 Catch-All
  {
    name: "NotFound",
    path: "*",
    component: NotFoundView,
  },
];

export default routes;
