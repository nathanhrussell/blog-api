// client-public/src/components/CommentList.jsx
import { useEffect, useState } from "react";
import { getApiEndpoint } from "../utils/api.js";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${getApiEndpoint("/api")}/posts/${postId}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => setError("Failed to load comments"))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (comments.length === 0) return <p>No comments yet.</p>;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {comments.map(comment => (
        <div key={comment.id} className="p-3 border rounded bg-gray-50">
          <p className="text-sm text-gray-800">{comment.content}</p>
          <p className="text-xs text-gray-500 mt-1">By {comment.username} on {new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
