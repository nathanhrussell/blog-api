import { useEffect, useState } from "react";
import axios from "axios";

function CommentsByPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/author/posts-with-comments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Comments by Post</h2>
      {posts.map((post) => (
        <div key={post.id} className="mb-6 border-b pb-4">
          <h3 className="font-semibold">{post.title}</h3>
          {post.comments?.length ? (
            <ul className="list-disc ml-6 mt-2">
              {post.comments.map((comment) => (
                <li key={comment.id}>
                  <strong>{comment.authorName}</strong>: {comment.content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No comments yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentsByPost;
