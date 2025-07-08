import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCommentsByPost(req, res) {
  const postId = parseInt(req.params.id);
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(comments);
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
