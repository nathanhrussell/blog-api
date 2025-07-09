const API_URL = "http://localhost:5000/api/posts";

export async function getPublishedPosts() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}