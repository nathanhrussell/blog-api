import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import PostDetail from "../../client-public/src/pages/PostDetail";
import CommentsByPost from "./pages/CommentsByPost";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/comments-by-post" element={<CommentsByPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
