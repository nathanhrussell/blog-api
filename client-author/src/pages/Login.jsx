import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginData = { username, password };
    console.log("Sending login data:", loginData);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      const data = await res.json();
      console.log("Login response data:", data);
      console.log("Token in response:", data.data?.token);
      console.log("All response keys:", Object.keys(data));

      if (!res.ok) {
        throw new Error(data.message || `Login failed with status ${res.status}`);
      }
      
      const token = data.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        onLogin(token);
      } else {
        console.error("Expected token but got:", data);
        throw new Error("No token received from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Author Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full border px-3 py-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border px-3 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-600 text-center">{error}</p>}
    </form>
  );
}

export default Login;