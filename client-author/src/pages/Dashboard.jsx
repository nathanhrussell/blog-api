// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

function Dashboard({ onLogout }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Posts data:", data);
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
      });
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Author Dashboard</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
      {!posts || posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  {post.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="space-x-2">
                <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded">
                  Edit
                </button>
                <button className="text-sm px-3 py-1 bg-yellow-500 text-white rounded">
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button className="text-sm px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Dashboard;