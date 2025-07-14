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

//
// 🌐 PUBLIC ROUTES (available to anyone)
//
router.get("/posts", getAllPublished);             // GET /api/posts
router.get("/posts/:id", getPublishedById);        // GET /api/posts/6

//
// 🔒 AUTHOR-ONLY ROUTES (require login)
//
router.get("/my-posts", authenticateUser, getAllByAuthor);             // GET /api/my-posts
router.get("/my-posts/:id", authenticateUser, getPostById);            // GET /api/my-posts/6
router.get("/posts-with-comments", authenticateUser, getPostsWithCommentsByAuthor); // GET /api/posts-with-comments

router.post("/posts", authenticateUser, requireAuthorRole, createPost);               // POST /api/posts
router.put("/posts/:id", authenticateUser, requireAuthorRole, updatePost);            // PUT /api/posts/6
router.delete("/posts/:id", authenticateUser, requireAuthorRole, deletePost);         // DELETE /api/posts/6
router.patch("/posts/:id/publish", authenticateUser, requireAuthorRole, togglePublish); // PATCH /api/posts/6/publish

export default router;
