import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Profile from "./pages/profile.jsx";
import Posts from "./pages/posts.jsx";
import Users from "./pages/users.jsx";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/users" element={<Users />} />
        </Routes>
    </Router>
  );
}

export default App;
