import { getApiEndpoint } from "../utils/api.js";

const API_URL = `${getApiEndpoint("/api")}/posts`;

export async function getPublishedPosts() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function getPostById(postId) {
  const res = await fetch(`${getApiEndpoint("/api")}/posts/${postId}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  const json = await res.json();
  return json.data;
}

export async function getCommentsByPostId(postId) {
    const res = await fetch(`${getApiEndpoint("/api")}/posts/${postId}/comments`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
}

export async function getPostsWithCommentsForAuthor() {
  const res = await fetch(`${getApiEndpoint("/api")}/author/posts-with-comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch posts with comments");
  const json = await res.json();
  return Array.isArray(json?.data?.data)
    ? json.data.data
    : json?.data || [];
}
