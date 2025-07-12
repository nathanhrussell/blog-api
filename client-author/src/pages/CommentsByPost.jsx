import { useEffect, useState } from "react";

function CommentsByPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const showMessage = (text, duration = 2000) => {
    setMessage(text);
    setTimeout(() => setMessage(null), duration);
  };

  const showError = (text, duration = 3000) => {
    setError(text);
    setTimeout(() => setError(null), duration);
  };

  useEffect(() => {
    const fetchPostsWithComments = async () => {
      try {
        const postsResponse = await fetch("http://localhost:5000/api/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }

        const postsJson = await postsResponse.json();
        const postsData = Array.isArray(postsJson?.data?.data)
          ? postsJson.data.data
          : Array.isArray(postsJson?.data)
          ? postsJson.data
          : Array.isArray(postsJson)
          ? postsJson
          : [];

        if (postsData.length === 0) {
          setPosts([]);
          return;
        }

        const postsWithComments = await Promise.all(
          postsData.map(async (post) => {
            try {
              const commentsResponse = await fetch(
                `http://localhost:5000/api/posts/${post.id}/comments`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              if (!commentsResponse.ok) {
                return { ...post, comments: [] };
              }

              const commentsJson = await commentsResponse.json();
              const comments = Array.isArray(commentsJson?.data)
                ? commentsJson.data
                : Array.isArray(commentsJson)
                ? commentsJson
                : [];

              return { ...post, comments };
            } catch {
              return { ...post, comments: [] };
            }
          })
        );

        setPosts(postsWithComments);
      } catch (err) {
        console.error("Error in fetchPostsWithComments:", err);
        showError("Failed to load posts with comments.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsWithComments();
  }, []);

  const handleDelete = async (commentId, postId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== commentId),
              }
            : post
        )
      );

      showMessage("Comment deleted.");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      showError("Failed to delete comment.");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Comments by Post</h2>

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

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="mb-6 border-b pb-4">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Post ID: {post.id}</p>

            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Comments ({post.comments.length}):
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  {post.comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="text-sm flex justify-between items-center gap-2"
                    >
                      <span>
                        <strong>{comment.username || comment.author || "Anonymous"}</strong>:{" "}
                        {comment.content || comment.text || "No content"}
                      </span>
                      <button
                        onClick={() => handleDelete(comment.id, post.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No comments yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CommentsByPost;
