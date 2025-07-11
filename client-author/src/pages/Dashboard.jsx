import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Dashboard({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const showMessage = (text, duration = 2000) => {
    setMessage(text);
    setTimeout(() => setMessage(null), duration);
  };

  const showError = (text, duration = 3000) => {
    setError(text);
    setTimeout(() => setError(null), duration);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const resJson = await res.json();
      const data = Array.isArray(resJson?.data?.data)
        ? resJson.data.data
        : resJson?.data || [];
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
      showError("Failed to fetch posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      showMessage("Post deleted.");
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
      showError("Error deleting post.");
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${post.id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ published: !post.published }),
      });
      showMessage(post.published ? "Post unpublished." : "Post published.");
      fetchPosts();
    } catch (err) {
      console.error("Failed to toggle publish status", err);
      showError("Error toggling publish status.");
    }
  };

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

      <button
        onClick={() => navigate("/new")}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        ➕ New Post
      </button>

      <Link
  to="/comments-by-post"
  className="inline-block mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
>
  💬 View Comments by Post
</Link>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
          {error}
        </div>
      )}

      {Array.isArray(posts) && posts.length === 0 ? (
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
                <button
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => navigate(`/edit/${post.id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-sm px-3 py-1 bg-yellow-500 text-white rounded"
                  onClick={() => handleTogglePublish(post)}
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(post.id)}
                >
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
