import { useEffect, useState } from "react";

function CommentsByPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Fetch the author's posts
      fetch("http://localhost:5000/api/posts/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((resJson) => {
          const postsData = Array.isArray(resJson?.data) ? resJson.data : [];
          // Fetch comments for each post
          Promise.all(
            postsData.map((post) =>
              fetch(`http://localhost:5000/api/posts/${post.id}/comments`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
                .then((res) => res.json())
                .then((commentsJson) => ({
                  ...post,
                  comments: commentsJson,
                }))
            )
          )
            .then((postsWithComments) => {
              setPosts(postsWithComments);
            })
            .catch((err) => {
              console.error("Failed to fetch posts with comments:", err);
              setPosts([]);
            })
            .finally(() => setLoading(false));
        })
        .catch((err) => {
          console.error("Failed to fetch author's posts:", err);
          setPosts([]);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Comments by Post</h2>
      {posts.map((post) => {
        console.log("Post:", post);
        console.log("Comments:", post.comments);
        return (
          <div key={post.id} className="mb-6 border-b pb-4">
            <h3 className="font-semibold">{post.title}</h3>
            {Array.isArray(post.comments) && post.comments?.length ? (
              <ul className="list-disc ml-6 mt-2">
                {post.comments.map((comment) => (
                  <li key={comment.id}>
                    <strong>{comment.username}</strong>: {comment.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No comments yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CommentsByPost;
