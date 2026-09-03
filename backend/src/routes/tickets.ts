import { Hono } from "hono";
import { db } from "../db/client";
import { tickets, activityLogs } from "../db/schema";
import { eq } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

export const ticketRoutes = new Hono();

// GET /api/projects/:projectId/tickets
ticketRoutes.get("/", async (c) => {
  const projectId = Number(c.req.param("projectId"));
  const all = await db.select().from(tickets).where(eq(tickets.projectId, projectId));
  return c.json(all);
});

ticketRoutes.post("/", async (c) => {
  const projectId = Number(c.req.param("projectId"));
  const { title, description, assigneeId } = await c.req.json();

  const [ticket] = await db
    .insert(tickets)
    .values({ projectId, title, description, assigneeId })
    .returning();

  return c.json(ticket, 201);
});

ticketRoutes.patch("/:id", async (c) => {
  const user = c.get("user") as JwtPayload;
  const id = Number(c.req.param("id"));
  const updates = await c.req.json(); // e.g. { status: "in_progress" }

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

ticketRoutes.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await db.delete(tickets).where(eq(tickets.id, id));
  return c.json({ ok: true });
});
