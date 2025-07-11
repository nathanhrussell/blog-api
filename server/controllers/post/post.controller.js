import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllPublished(req, res) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true, comments: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({ data: posts });
}

export async function getPublishedById(req, res) {
  const post = await prisma.post.findFirst({
    where: { id: parseInt(req.params.id), published: true },
    include: { author: true, comments: true },
  });

  if (!post) return res.status(404).json({ error: "Post not found" });

  res.json({ data: post });
}

export async function createPost(req, res) {
  const { title, content } = req.body;
  const userId = req.user.id;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: userId,
    },
  });

  res.status(201).json({ data: post });
}

export async function updatePost(req, res) {
  const { title, content } = req.body;
  const postId = parseInt(req.params.id);

  const post = await prisma.post.update({
    where: { id: postId },
    data: { title, content },
  });

  res.json({ data: post });
}

export async function deletePost(req, res) {
  const postId = parseInt(req.params.id);

  await prisma.post.delete({ where: { id: postId } });

  res.json({ message: "Post deleted" });
}

export async function togglePublish(req, res) {
  const postId = parseInt(req.params.id);
  const { published } = req.body;

  const post = await prisma.post.update({
    where: { id: postId },
    data: { published },
  });

  res.json({ data: post });
}

export async function getAllByAuthor(req, res) {
  console.log("🔐 Author ID from token:", req.user.id);
  const posts = await prisma.post.findMany({
    where: { authorId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  console.log("📝 Posts returned:", posts);
  res.json({ data: posts });
}

// PRIVATE: Get a post by ID for the author
export async function getPostById(req, res) {
  const postId = parseInt(req.params.id);
  const userId = req.user.id;

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      authorId: userId,
    },
  });

  if (!post) return res.status(404).json({ error: "Post not found" });

  res.json({ data: post });
}
