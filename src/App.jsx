import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from './Screens/auth/login';
import SignupPage from './Screens/auth/signup';
import ControlBoard from './Screens/dashboard/controlBoard'
import AITools from "./Screens/dashboard/aiTools";
import MyBooks from "./Screens/dashboard/myBooks";
import NewBooks from "./Screens/dashboard/newBookPublish";
import InterActiveStory from "./Screens/dashboard/NewInteractiveStory";
import Ratings from "./Screens/dashboard/ratings";
import Settings from "./Screens/dashboard/Settings";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* auth screens */}
      <Route path="/Screens/auth/login" element={<LoginPage />} />
      <Route path="/Screens/auth/signup" element={<SignupPage />} />
      {/* dashboard screens */}
      <Route path="/Screens/dashboard/controlBoard" element={<ControlBoard />} />
      <Route path="/Screens/dashboard/myBooks" element={<MyBooks />} />
      <Route path="/Screens/dashboard/newBookPublish" element={<NewBooks />} />
      <Route path="/Screens/dashboard/NewInteractiveStory" element={<InterActiveStory />} />
      <Route path="/Screens/dashboard/ratings" element={<Ratings />} />
      <Route path="/Screens/dashboard/Settings" element={<Settings />} />
      <Route path="/Screens/dashboard/aiTools" element={<AITools />} />

    </Routes>
  );
}

export default App;
