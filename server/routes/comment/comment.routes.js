import express from "express";
import {
  getCommentsByPost,
  createComment,
  deleteComment,
  updateComment,
} from "../../controllers/comment/comment.controller.js";

import {
  authenticateUser,
  requireAuthorRole
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/posts/:id/comments", getCommentsByPost);
router.post("/posts/:id/comments", createComment);

router.delete("/comments/:id", authenticateUser, requireAuthorRole, deleteComment);
router.put("/comments/:id", authenticateUser, requireAuthorRole, updateComment);


export default router;
