import { Hono } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "hono/cookie";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

import { authMiddleware, type JwtPayload } from "../middleware/auth";

// 1. Declare the type for context variables
type Env = {
  Variables: {
    user: JwtPayload;
  }
}

// 2. Pass Env as the generic to Hono
export const authRoutes = new Hono<Env>();

authRoutes.get("/me", authMiddleware, async (c) => {
  // Now c.get("user") is automatically typed as JwtPayload
  const user = c.get("user");
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.sub),
  });
  if (!dbUser) return c.json({ error: "User not found" }, 401);
  return c.json({ id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role });
});

authRoutes.post("/register", async (c) => {
  const { name, email, password } = await c.req.json();

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) return c.json({ error: "Email already registered" }, 400);

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({ name, email, passwordHash }).returning();

  return c.json({ id: user.id, name: user.name, email: user.email });
});

authRoutes.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return c.json({ error: "Invalid credentials" }, 401);

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  setCookie(c, "token", token, { httpOnly: true, path: "/", sameSite: "Lax" });

  return c.json({ id: user.id, name: user.name, role: user.role });
});

authRoutes.post("/logout", async (c) => {
  setCookie(c, "token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return c.json({ ok: true });
});
