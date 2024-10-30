import './App.css';

import { Routes, Route } from 'react-router-dom';
import Home from "./components/home";
import Explore from './components/explore';
import Messages from './components/messages';
import Profile from './components/profile';
import Notifications from './components/notifications';
import Post from './components/post';
import LoginPage from './components/loginPage';
import SignupPage from './components/signupPage';
import LandingPage from './components/landingPage';
import PrivateRoutes from './components/protectedRoute';
//blue gray p314 second book
const app = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/tweet/:slug" element={<Post />}/>
            <Route path="/:slug" element={<Profile />} />
        </Route>
        
        <Route path='/landing' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </>
  );
}

export default app;
