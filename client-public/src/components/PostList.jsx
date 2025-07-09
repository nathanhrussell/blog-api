import { useEffect, useState } from "react";
import { getPublishedPosts } from "../api/posts";

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
        <div key={post.id} className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
