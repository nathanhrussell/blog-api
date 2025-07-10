import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

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

  return (
    <>
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome, Author</h1>
          <p className="text-gray-600 mb-4">You are logged in.</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default App;
