import { useEffect, useState } from "react";

function CommentsByPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/posts-with-comments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        const data = Array.isArray(resJson?.data?.data)
          ? resJson.data.data
          : resJson?.data || [];
        setPosts(data);
      })
      .catch((err) => {
        console.error("Failed to fetch posts with comments:", err);
        setPosts([]);
      })
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
