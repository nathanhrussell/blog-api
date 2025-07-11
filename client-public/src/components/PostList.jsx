import { useEffect, useState } from "react";
import { getPublishedPosts } from "../api/posts";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);

useEffect(() => {
  getPublishedPosts()
    .then(response => {
      console.log("Fetched posts:", response);
      console.log("🧪 Full API response:", response);
      const postsArray = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setPosts(postsArray);
    })
    .catch(error => {
      console.error("Error fetching posts:", error);
      setPosts([]);
    });
}, []);


  if (!Array.isArray(posts)) {
    return <p>Invalid data received from API.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map(post => (
        <div key={post.id} className="border p-4 rounded bg-white shadow">
              <Link to={`/posts/${post.id}`}>
      <h2 className="text-xl font-bold text-blue-600 hover:underline">
        {post.title}
      </h2>
    </Link>
          <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
          <Link to={`/posts/${post.id}`} className="text-blue-500 underline">
            Read more
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PostList;
