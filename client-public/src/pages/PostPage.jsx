import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, getCommentsByPostId } from "../api/posts";
import CommentForm from "../components/CommentForm";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getPostById(id).then(setPost).catch(console.error);
    fetchComments();
  }, [id]);

function fetchComments() {
  getCommentsByPostId(id).then(setComments).catch(console.error);
}
  if (!post) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <Link to={`/posts/${post.id}`}>
  <h1 className="text-xl font-bold text-blue-600 hover:underline">
    {post.title}
  </h1>
</Link>
      <p>{post.content}</p>
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {comments.map(comment => (
              <li key={comment.id} className="bg-white p-3 shadow rounded">
                <strong>{comment.username}</strong>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
        <CommentForm postId={id} onCommentSubmitted={fetchComments} />
      </section>

    </main>
  );
}

export default PostPage;
