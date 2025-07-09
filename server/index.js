import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/post/post.routes.js";
import authRoutes from "./routes/auth/auth.routes.js";
import commentRoutes from "./routes/comment/comment.routes.js";
import { errorHandler } from "../middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", commentRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
