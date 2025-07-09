import { useEffect, useState } from "react";
import { getPublishedPosts } from "../api/posts";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPublishedPosts()
      .then(setPosts)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map(post => (
        <Link
          to={`/posts/${post.id}`}
          key={post.id}
          className="block border p-4 rounded bg-white shadow hover:bg-gray-100 transition"
        >
          <h2 className="text-xl font-bold text-blue-700">{post.title}</h2>
          <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
        </Link>
      ))}
    </div>
  );
}

export default PostList;
