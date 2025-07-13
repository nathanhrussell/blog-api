import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiEndpoint } from "../utils/api.js";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("PostDetail component mounted, ID:", id); // Debug log

  // Fetch post
  useEffect(() => {
    fetch(`${getApiEndpoint("/api")}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Post API response:", data); // Debug log
        if (data && data.data && data.data.title) {
          setPost(data.data); // Extract post from data.data
          console.log("Post set:", data.data); // Debug log
        } else {
          setError("Post not found.");
          console.log("Post not found, full response:", data); // Debug log
        }
      })
      .catch((err) => {
        console.error("Error fetching post:", err); // Debug log
        setError("Failed to load post.");
      });
  }, [id]);

  // Fetch comments
  useEffect(() => {
    fetch(`${getApiEndpoint("/api")}/posts/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setComments([]);
        setLoading(false);
      });
  }, [id]);

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !commentContent.trim()) return;

    try {
      const res = await fetch(`${getApiEndpoint("/api")}/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: commentContent }),
      });

      if (!res.ok) throw new Error();

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setUsername("");
      setCommentContent("");
    } catch {
      alert("Failed to submit comment.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && <p className="text-red-600">{error}</p>}

      {post && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      )}

      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border rounded p-2 mb-2 bg-gray-50">
              <p>
                <strong>User:</strong> {c.username}
              </p>
              <p>
                <strong>Comment:</strong> {c.content}
              </p>
            </div>
          ))
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <div>
            <label className="block font-semibold">Username</label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">Comment</label>
            <textarea
              className="w-full border px-2 py-1 rounded"
              rows="3"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostDetail;