import { Hono } from "hono";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

// 1. Declare the type for context variables
type Env = {
  Variables: {
    user: JwtPayload;
  }
}

// 2. Pass Env as the generic to Hono
export const userRoutes = new Hono<Env>();

// GET /api/users - daftar semua user untuk assignee & admin management
userRoutes.get("/", async (c) => {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);

  return c.json(allUsers);
});

// PATCH /api/users/:id/role - ubah role (hanya admin)
userRoutes.patch("/:id/role", async (c) => {
  const currentUser = c.get("user");
  if (currentUser.role !== "admin") {
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }

  const targetId = Number(c.req.param("id"));
  const { role } = await c.req.json();

  if (role !== "admin" && role !== "user") {
    return c.json({ error: "Invalid role value. Must be 'admin' or 'user'" }, 400);
  }

  const [updatedUser] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, targetId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  if (!updatedUser) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(updatedUser);
});
