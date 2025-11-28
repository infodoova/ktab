import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from './Screens/auth/login';
import SignupPage from './Screens/auth/signup';

// Author Pages
import ControlBoard from './Screens/dashboard/AuthorPages/controlBoard';
import AITools from "./Screens/dashboard/AuthorPages/aiTools";
import MyBooks from "./Screens/dashboard/AuthorPages/myBooks";
import NewBooks from "./Screens/dashboard/AuthorPages/newBookPublish";
import InterActiveStory from "./Screens/dashboard/AuthorPages/NewInteractiveStory";
import Ratings from "./Screens/dashboard/AuthorPages/ratings";
import Settings from "./Screens/dashboard/AuthorPages/Settings";

// Reader Pages
import MainPage from "./Screens/dashboard/ReaderPages/MainPage";
import InteractiveStories from "./Screens/dashboard/ReaderPages/InteractiveStories";
import Profile from "./Screens/dashboard/ReaderPages/Profile";
import Library from "./Screens/dashboard/ReaderPages/library";
import ReaderSettings from "./Screens/dashboard/ReaderPages/Settings"; 

import RoleError from "./Screens/roleError";

// Import Guards
import RoleGuard from "../guards/roleGuard";
import GuestGuard from "../guards/GuestGuard"; 

function App() {
  return (
    <Routes>

      {/* ===========================
          GUEST PAGES (Redirects if logged in)
         =========================== */}
      <Route element={<GuestGuard />}>
            <Route path="/" element={<HomePage />} />

        <Route path="/Screens/auth/login" element={<LoginPage />} />
        <Route path="/Screens/auth/signup" element={<SignupPage />} />
      </Route>

      {/* ===========================
          AUTHOR PAGES (role = AUTHOR)
         =========================== */}
              
                
        <Route path="/Screens/dashboard/AuthorPages/aiTools" element={<AITools />} />
         <Route path="/Screens/dashboard/AuthorPages/myBooks" element={<MyBooks />} />


      <Route element={<RoleGuard allowedRoles={["AUTHOR"]} />}>
        <Route path="/Screens/dashboard/AuthorPages/controlBoard" element={<ControlBoard />} />
        <Route path="/Screens/dashboard/AuthorPages/NewInteractiveStory" element={<InterActiveStory />} />
          <Route path="/Screens/dashboard/AuthorPages/newBookPublish" element={<NewBooks />} />
        <Route path="/Screens/dashboard/AuthorPages/Settings" element={<Settings />} />
        <Route path="/Screens/dashboard/AuthorPages/ratings" element={<Ratings />} />
      </Route>

      {/* ===========================
          READER PAGES (role = READER)
         =========================== */}
      <Route element={<RoleGuard allowedRoles={["READER"]} />}>
        <Route path="/Screens/dashboard/ReaderPages/MainPage" element={<MainPage />} />
        <Route path="/Screens/dashboard/ReaderPages/InteractiveStories" element={<InteractiveStories />} />
        <Route path="/Screens/dashboard/ReaderPages/Profile" element={<Profile />} />
        <Route path="/Screens/dashboard/ReaderPages/library" element={<Library />} />
        <Route path="/Screens/dashboard/ReaderPages/Settings" element={<ReaderSettings />} />
      </Route>

      {/* Role error page (Public or Protected? Usually public is fine) */}
      <Route path="/Screens/roleError" element={<RoleError />} />

    </Routes>
  );
}

export default App;