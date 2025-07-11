import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCommentsByPost(req, res) {
  const postId = parseInt(req.params.id);

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });

    const formatted = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      username: comment.user?.username || "Anonymous",
      createdAt: comment.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    res.status(500).json({ error: "Server error" });
  }
}


export async function createComment(req, res) {
  const postId = parseInt(req.params.id);
  const { username, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ error: "Username and content are required" });
  }

  let user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    user = await prisma.user.create({
      data: { username, password: "", role: "USER" }
    });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId: user.id
    }
  });

  res.status(201).json(comment);
}

export async function deleteComment(req, res) {
  const id = parseInt(req.params.id);
  await prisma.comment.delete({ where: { id } });
  res.json({ message: "Comment deleted" });
}

export async function updateComment(req, res) {
  const id = parseInt(req.params.id);
  const { content } = req.body;

  const updated = await prisma.comment.update({
    where: { id },
    data: { content }
  });

  res.json(updated);
}

export async function getPostsWithCommentsByAuthor(req, res) {
  const authorId = req.user.id;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const data = posts.map((post) => ({
      id: post.id,
      title: post.title,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        username: comment.user?.username || "Anonymous",
        createdAt: comment.createdAt,
      })),
    }));

    res.json({ data });
  } catch (err) {
    console.error("Failed to fetch posts with comments:", err);
    res.status(500).json({ error: "Server error" });
  }
}