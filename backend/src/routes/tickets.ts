import { Hono } from "hono";
import { db } from "../db/client";
import { tickets, users, comments, activityLogs } from "../db/schema";
import { eq } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

// 1. Declare the type for context variables
type Env = {
  Variables: {
    user: JwtPayload;
  }
}

// 2. Pass Env as the generic to Hono
export const ticketRoutes = new Hono<Env>();

// GET /api/projects/:projectId/tickets
ticketRoutes.get("/", async (c) => {
  const projectId = Number(c.req.param("projectId"));

  const all = await db
    .select({
      id: tickets.id,
      projectId: tickets.projectId,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      assigneeId: tickets.assigneeId,
      createdAt: tickets.createdAt,
      assigneeName: users.name,
      assigneeEmail: users.email,
    })
    .from(tickets)
    .leftJoin(users, eq(tickets.assigneeId, users.id))
    .where(eq(tickets.projectId, projectId));

  // Format assignee as an object if exists
  const formatted = all.map((t) => ({
    id: t.id,
    projectId: t.projectId,
    title: t.title,
    description: t.description,
    status: t.status,
    assigneeId: t.assigneeId,
    createdAt: t.createdAt,
    assignee: t.assigneeId
      ? {
        id: t.assigneeId,
        name: t.assigneeName,
        email: t.assigneeEmail,
      }
      : null,
  }));

  return c.json(formatted);
});

// POST /api/projects/:projectId/tickets
ticketRoutes.post("/", async (c) => {
  const projectId = Number(c.req.param("projectId"));
  const { title, description, assigneeId, status } = await c.req.json();

  const [ticket] = await db
    .insert(tickets)
    .values({
      projectId,
      title,
      description,
      assigneeId: assigneeId ? Number(assigneeId) : null,
      status: status || "todo",
    })
    .returning();

  return c.json(ticket, 201);
});

// PATCH /api/projects/:projectId/tickets/:id
ticketRoutes.patch("/:id", async (c) => {
  const user = c.get("user");
  const id = Number(c.req.param("id"));
  const updates = await c.req.json(); // e.g. { status, title, description, assigneeId }

  if (updates.assigneeId !== undefined) {
    updates.assigneeId = updates.assigneeId ? Number(updates.assigneeId) : null;
  }

  const [ticket] = await db.update(tickets).set(updates).where(eq(tickets.id, id)).returning();

  if (updates.status) {
    await db.insert(activityLogs).values({
      ticketId: id,
      actorId: user.sub,
      action: "status_changed",
      meta: JSON.stringify({ status: updates.status }),
    });
  }

  return c.json(ticket);
});

// DELETE /api/projects/:projectId/tickets/:id (Hanya Admin / Project Member)
ticketRoutes.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = Number(c.req.param("id"));

  // Check admin role
  if (user.role !== "admin") {
    return c.json({ error: "Forbidden: Hanya admin yang dapat menghapus tiket" }, 403);
  }

  // Cascade delete comments and logs for this ticket
  await db.delete(comments).where(eq(comments.ticketId, id));
  await db.delete(activityLogs).where(eq(activityLogs.ticketId, id));
  await db.delete(tickets).where(eq(tickets.id, id));

  return c.json({ ok: true });
});
