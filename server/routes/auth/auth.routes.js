import express from "express";

import { register, login } from "../../controllers/auth/auth.controller.js"
import { requireFields } from '../../../middlewares/validate.mjs';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)

router.post("/register", requireFields(["username", "password"]), register);

export default router;