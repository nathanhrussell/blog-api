// client-public/src/pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentList from "../components/CommentList";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setPost(data);
      })
      .catch(err => {
        console.error("Error loading post:", err);
        setError("Failed to load post");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <CommentList postId={post.id} />
    </div>
  );
}

export default PostDetail;
