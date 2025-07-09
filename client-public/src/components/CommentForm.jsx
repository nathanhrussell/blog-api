import { useState } from "react";

function CommentForm({ postId, onCommentSubmitted }) {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !content) {
      setError("Username and comment content are required.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content }),
      });

      if (!res.ok) throw new Error("Failed to submit comment");

      setUsername("");
      setContent("");
      onCommentSubmitted();
    } catch (err) {
      setError("Error submitting comment.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="block font-medium mb-1">Username</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Comment</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Comment
      </button>
    </form>
  );
}

export default CommentForm;
