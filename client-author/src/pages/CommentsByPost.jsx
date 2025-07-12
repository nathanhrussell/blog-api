import { useEffect, useState } from "react";

function CommentsByPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostsWithComments = async () => {
      try {
        console.log("Starting to fetch posts...");
        
        // Fetch the author's posts
        const postsResponse = await fetch("http://localhost:5000/api/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        console.log("Posts response status:", postsResponse.status);
        
        if (!postsResponse.ok) {
          throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
        }
        
        const postsJson = await postsResponse.json();
        console.log("Posts response JSON:", postsJson);
        
        // Handle nested data structure - the posts might be in postsJson.data.data
        const postsData = Array.isArray(postsJson?.data?.data) ? postsJson.data.data :
                         Array.isArray(postsJson?.data) ? postsJson.data : 
                         Array.isArray(postsJson) ? postsJson : [];
        
        console.log("Extracted posts data:", postsData);
        
        if (postsData.length === 0) {
          console.log("No posts found");
          setPosts([]);
          setLoading(false);
          return;
        }
        
        // Fetch comments for each post
        console.log("Fetching comments for", postsData.length, "posts");
        
        const postsWithComments = await Promise.all(
          postsData.map(async (post) => {
            try {
              console.log(`Fetching comments for post ${post.id}`);
              
              const commentsResponse = await fetch(`http://localhost:5000/api/posts/${post.id}/comments`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              
              console.log(`Comments response status for post ${post.id}:`, commentsResponse.status);
              
              if (!commentsResponse.ok) {
                console.warn(`Failed to fetch comments for post ${post.id}: ${commentsResponse.status}`);
                return { ...post, comments: [] };
              }
              
              const commentsJson = await commentsResponse.json();
              console.log(`Comments for post ${post.id}:`, commentsJson);
              
              // Handle different response formats
              const comments = Array.isArray(commentsJson?.data) ? commentsJson.data :
                              Array.isArray(commentsJson) ? commentsJson : [];
              
              return { ...post, comments };
            } catch (err) {
              console.error(`Error fetching comments for post ${post.id}:`, err);
              return { ...post, comments: [] };
            }
          })
        );
        
        console.log("Final posts with comments:", postsWithComments);
        setPosts(postsWithComments);
        
      } catch (err) {
        console.error("Error in fetchPostsWithComments:", err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsWithComments();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Comments by Post</h2>
      
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => {
          console.log("Rendering post:", post);
          console.log("Post comments:", post.comments);
          
          return (
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
                      <li key={comment.id} className="text-sm">
                        <strong>{comment.username || comment.author || 'Anonymous'}</strong>: {comment.content || comment.text || 'No content'}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">No comments yet.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default CommentsByPost;