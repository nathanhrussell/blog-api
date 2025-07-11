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

import { authenticateUser, requireAuthorRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/posts", authenticateUser, getAllByAuthor);
router.get("/posts/:id", authenticateUser, getPostById);

router.get("/", getAllPublished);
router.get("/:id", getPublishedById);

router.post("/", authenticateUser, requireAuthorRole, createPost);
router.put("/:id", authenticateUser, requireAuthorRole, updatePost);
router.delete("/:id", authenticateUser, requireAuthorRole, deletePost);
router.patch("/:id/publish", authenticateUser, requireAuthorRole, togglePublish);


export default router;