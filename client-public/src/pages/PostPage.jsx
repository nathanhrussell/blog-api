import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, getCommentsByPostId } from "../api/posts";
import CommentForm from "../components/CommentForm";
import { Link } from "react-router-dom";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getPostById(id)
      .then(data => {
        console.log("Fetched post:", data);
        setPost(data.data); // Extract post from data.data
      })
      .catch(console.error);

    fetchComments();
  }, [id]);

  function fetchComments() {
    getCommentsByPostId(id)
      .then(response => {
        console.log("Fetched comments:", response.data);
        setComments(response.data);
      })
      .catch(console.error);
  }

  if (!post) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-4">
      <Link to={`/posts/${post.id}`}>
        <h1 className="text-xl font-bold text-blue-600 hover:underline">
          {post.title}
        </h1>
      </Link>
      <div
        className="prose max-w-none prose-headings:font-bold prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-a:text-blue-600 prose-a:hover:underline prose-img:rounded prose-img:shadow"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
        <ul className="space-y-2 mb-6">
          {comments.map(comment => (
            <li key={comment.id} className="bg-white p-3 shadow rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">User:</span> {comment.username}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Comment:</span> {comment.content}
              </p>
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