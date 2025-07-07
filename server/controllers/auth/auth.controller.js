import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

const prisma = new PrismaClient();

export async function register(req, res) {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return res.status(400).json({ error: "Username already exists." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed, role },
  });

  const token = generateToken(user);
  res.json({ token });
}

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token });
}
