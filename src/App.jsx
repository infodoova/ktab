import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./Screens/auth/login";
import SignupPage from "./Screens/auth/signup";
// Author Pages
import ControlBoard from "./Screens/dashboard/AuthorPages/controlBoard";
import AITools from "./Screens/dashboard/AuthorPages/aiTools";
import MyBooks from "./Screens/dashboard/AuthorPages/myBooks";
import NewBooks from "./Screens/dashboard/AuthorPages/newBookPublish";
import InterActiveStory from "./Screens/dashboard/AuthorPages/NewInteractiveStory";
import Ratings from "./Screens/dashboard/AuthorPages/ratings";
import Settings from "./Screens/dashboard/AuthorPages/Settings";
import MyStories from "./Screens/dashboard/AuthorPages/mystories";
// Reader Pages
import MainPage from "./Screens/dashboard/ReaderPages/MainPage";
import InteractiveStories from "./Screens/dashboard/ReaderPages/InteractiveStories";
import InteractiveDashboard from "./Screens/dashboard/ReaderPages/interactiveDashboard/mainComp";
import Profile from "./Screens/dashboard/ReaderPages/Profile";
import Library from "./Screens/dashboard/ReaderPages/Library";
import Achievements from "./Screens/dashboard/ReaderPages/Achievements";
import ReaderSettings from "./Screens/dashboard/ReaderPages/Settings";
import BookDisplay from "./Screens/dashboard/ReaderPages/BookDisplayPage/[id]";
import BookDetails from "./Screens/dashboard/ReaderPages/BookDetails/BookDetails";
import RoleError from "./Screens/roleError";
import Forbidden404 from "./Screens/404forbidden";
import Share from "./Screens/Share";
// Import Guards
import RoleGuard from "../guards/roleGuard";
import GuestGuard from "../guards/GuestGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* ===========================
          GUEST PAGES (Redirects if logged in)
         =========================== */}

      <Route element={<GuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="Screens/auth/login"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="Screens/auth/signup"
          element={<Navigate to="/signup" replace />}
        />
      </Route>

      {/* ===========================
          AUTHOR PAGES (role = AUTHOR)
         =========================== */}

      <Route element={<RoleGuard allowedRoles={["AUTHOR"]} />}>
        <Route path="/author/control" element={<ControlBoard />} />
        <Route
          path="/author/interactive-story"
          element={<InterActiveStory />}
        />
        <Route path="/author/my-stories" element={<MyStories />} />

        <Route path="/author/new-book" element={<NewBooks />} />
        <Route path="/author/books/edit/:draftId" element={<NewBooks />} />
        <Route path="/author/settings" element={<Settings />} />
        <Route path="/author/ratings" element={<Ratings />} />
        <Route path="/author/ai-tools" element={<AITools />} />
        <Route path="/author/my-books" element={<MyBooks />} />

        {/* Redirects from old long author paths */}
        <Route
          path="/Screens/dashboard/AuthorPages/controlBoard"
          element={<Navigate to="/author/control" replace />}
        />

        <Route
          path="/Screens/dashboard/AuthorPages/newBookPublish"
          element={<Navigate to="/author/new-book" replace />}
        />

        <Route
          path="/Screens/dashboard/AuthorPages/Settings"
          element={<Navigate to="/author/settings" replace />}
        />
        <Route
          path="/Screens/dashboard/AuthorPages/ratings"
          element={<Navigate to="/author/ratings" replace />}
        />
        <Route
          path="/Screens/dashboard/AuthorPages/NewInteractiveStory"
          element={<Navigate to="/author/interactive-story" replace />}
        />
        <Route
          path="/Screens/dashboard/AuthorPages/mystories"
          element={<Navigate to="/author/my-stories" replace />}
        />
        <Route
          path="/Screens/dashboard/AuthorPages/aiTools"
          element={<Navigate to="/author/ai-tools" replace />}
        />
        <Route
          path="/Screens/dashboard/AuthorPages/myBooks"
          element={<Navigate to="/author/my-books" replace />}
        />
      </Route>

      {/* ===========================
          READER PAGES (role = READER)
         =========================== */}

      <Route element={<RoleGuard allowedRoles={["READER"]} />}>
        <Route path="/reader/home" element={<MainPage />} />
        <Route path="/reader/BookDetails/:id" element={<BookDetails />} />
        <Route path="/reader/display/:id" element={<BookDisplay />} />
        <Route path="/reader/Achievements" element={<Achievements />} />
        <Route
          path="/reader/interactive-stories"
          element={<InteractiveStories />}
        />
        <Route
          path="/reader/interactive-stories/play"
          element={<InteractiveDashboard />}
        />
        <Route path="/reader/profile" element={<Profile />} />
        <Route path="/reader/library" element={<Library />} />
        <Route path="/reader/settings" element={<ReaderSettings />} />

        {/* Redirects from old long reader paths */}
        <Route
          path="/Screens/dashboard/ReaderPages/MainPage"
          element={<Navigate to="/reader/home" replace />}
        />
        <Route
          path="/Screens/dashboard/ReaderPages/Achievements"
          element={<Navigate to="/reader/Achievements" replace />}
        />
        <Route
          path="/Screens/dashboard/ReaderPages/BookDetails/:id"
          element={<Navigate to="/reader/BookDetails/:id" replace />}
        />
        <Route
          path="/Screens/dashboard/ReaderPages/BookDisplayPage/:id"
          element={<Navigate to="/reader/display/:id" replace />}
        />
        <Route
          path="/Screens/dashboard/ReaderPages/InteractiveStories"
          element={<Navigate to="/reader/interactive-stories" replace />}
        />
        <Route
          path="/Screens/dashboard/ReaderPages/Profile"
          element={<Navigate to="/reader/profile" replace />}
        />
        <Route
          path="/Screens/dashboard/ReaderPages/library"
          element={<Navigate to="/reader/library" replace />}
        />
        <Route
          path="/Screens/dashboard/ReaderPages/Settings"
          element={<Navigate to="/reader/settings" replace />}
        />
      </Route>

      {/* Role error page (Public or Protected? Usually public is fine) */}
      <Route path="/role-error" element={<RoleError />} />
      <Route
        path="/Screens/roleError"
        element={<Navigate to="/role-error" replace />}
      />
      <Route path="*" element={<Forbidden404 />} />
      <Route path="/share" element={<Share />} />
    </Routes>
  );
}

export default App;
