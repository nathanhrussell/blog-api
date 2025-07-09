const API_URL = "http://localhost:5000/api/posts";

export async function getPublishedPosts() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function getPostById(postId) {
  const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  const json = await res.json();
  return json.data;
}

export async function getCommentsByPostId(postId) {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
}