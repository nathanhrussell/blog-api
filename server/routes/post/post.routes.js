import express from "express";
import {
  getAllPublished,
  getPublishedById,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
  getAllByAuthor,
  getPostById
} from "../../controllers/post/post.controller.js";

import { getPostsWithCommentsByAuthor } from "../../controllers/comment/comment.controller.js";
import { authenticateUser, requireAuthorRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/posts", authenticateUser, getAllByAuthor);
router.get("/posts/:id", authenticateUser, getPostById);
router.get("/posts-with-comments", authenticateUser, getPostsWithCommentsByAuthor);
router.post("/posts", authenticateUser, requireAuthorRole, createPost);
router.put("/posts/:id", authenticateUser, requireAuthorRole, updatePost);
router.delete("/posts/:id", authenticateUser, requireAuthorRole, deletePost);
router.patch("/posts/:id/publish", authenticateUser, requireAuthorRole, togglePublish);

router.get("/", getAllPublished);
router.get("/:id", getPublishedById);

export default router;
