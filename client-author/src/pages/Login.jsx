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
    
    // Debug environment variable
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("All env vars:", import.meta.env);
    
    // Temporary hardcode since .env is in .gitignore
    const apiUrl = import.meta.env.VITE_API_URL || 'https://blog-api-cg35.onrender.com';
    console.log("Raw API URL from env:", import.meta.env.VITE_API_URL);
    
    // Remove trailing slash from apiUrl if it exists, then add the endpoint
    const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const fullUrl = `${cleanApiUrl}/api/auth/login`; // Added /api prefix
    console.log("Clean API URL:", cleanApiUrl);
    console.log("Full URL being called:", fullUrl);

    try {
      const res = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);
      console.log("Response URL:", res.url);

      // Check if response is actually JSON
      const contentType = res.headers.get('content-type');
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.includes('application/json')) {
        // If it's not JSON, get the text to see what we're actually receiving
        const text = await res.text();
        console.log("Response text (not JSON):", text);
        throw new Error(`Server returned ${res.status}: Expected JSON but got ${contentType}`);
      }

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