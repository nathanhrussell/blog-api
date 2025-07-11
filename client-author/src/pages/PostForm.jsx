import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TiptapEditor from "./TiptapEditor";

function PostForm({ mode, postId = null }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode !== "edit" || !postId) return;

    const loadPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const resJson = await res.json();
        const data = resJson.data || resJson;

        console.log("✏️ Loaded post data:", data);

        if (data.error) {
          setError(data.error);
        } else {
          setTitle(data.title || "");
          setContent(data.content || "");
        }
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [mode, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    const payload = { title, content };
    const url =
      mode === "edit"
        ? `http://localhost:5000/api/posts/${postId}`
        : "http://localhost:5000/api/posts";
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Submission failed.");
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "edit" ? "Edit Post" : "Create New Post"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Content</label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mode === "edit" ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default PostForm;
