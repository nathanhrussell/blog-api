import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAuthorRole(req, res, next) {
  if (req.user?.role !== "AUTHOR") {
    return res.status(403).json({ error: "Author access required" });
  }
  next();
}
