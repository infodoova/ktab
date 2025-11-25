import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from './Screens/auth/login';
import SignupPage from './Screens/auth/signup';
import ControlBoard from './components/myui/Users/ReaderPages/AuthorPages/controlBoard'
import AITools from "./components/myui/Users/ReaderPages/AuthorPages/aiTools";
import MyBooks from "./components/myui/Users/ReaderPages/AuthorPages/myBooks";
import NewBooks from "./components/myui/Users/ReaderPages/AuthorPages/newBookPublish";
import InterActiveStory from "./components/myui/Users/ReaderPages/AuthorPages/NewInteractiveStory";
import Ratings from "./components/myui/Users/ReaderPages/AuthorPages/ratings";
import Settings from "./components/myui/Users/ReaderPages/AuthorPages/Settings";
import MainPage from "./Screens/dashboard/ReaderPages/MainPage";
import InteractiveStories from "./Screens/dashboard/ReaderPages/InteractiveStories";
import Profile from "./Screens/dashboard/ReaderPages/Profile"; 
import Library from "./Screens/dashboard/ReaderPages/library";
import ReaderSettings from "./Screens/dashboard/ReaderPages/Settings"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* auth screens */}
      <Route path="/Screens/auth/login" element={<LoginPage />} />
      <Route path="/Screens/auth/signup" element={<SignupPage />} />
      {/* Author screens */}
      <Route path="/Screens/dashboard/AuthorPages/controlBoard" element={<ControlBoard />} />
      <Route path="/Screens/dashboard/AuthorPages/myBooks" element={<MyBooks />} />
      <Route path="/Screens/dashboard/AuthorPages/newBookPublish" element={<NewBooks />} />
      <Route path="/Screens/dashboard/AuthorPages/NewInteractiveStory" element={<InterActiveStory />} />
      <Route path="/Screens/dashboard/AuthorPages/ratings" element={<Ratings />} />
      <Route path="/Screens/dashboard/AuthorPages/Settings" element={<Settings />} />
      <Route path="/Screens/dashboard/AuthorPages/aiTools" element={<AITools />} />
      {/* Reader screens */}
      <Route path="/Screens/dashboard/ReaderPages/MainPage" element={<MainPage />} />
      <Route path="/Screens/dashboard/ReaderPages/InteractiveStories" element={<InteractiveStories />} />
      <Route path="/Screens/dashboard/ReaderPages/Profile" element={<Profile />} />
      <Route path="/Screens/dashboard/ReaderPages/library" element={<Library />} />
      <Route path="/Screens/dashboard/ReaderPages/Settings" element={<ReaderSettings />} />

    </Routes>
  );
}

export default App;
