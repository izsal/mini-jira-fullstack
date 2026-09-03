import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export type JwtPayload = { sub: number; role: "admin" | "user" };

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header("cookie")?.match(/token=([^;]+)/)?.[1];

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
}

export function requireRole(role: "admin" | "user") {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as JwtPayload;
    if (user.role !== role && user.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }
    await next();
  };
}
