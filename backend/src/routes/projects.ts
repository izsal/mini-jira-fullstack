import { Hono } from "hono";
import { db } from "../db/client";
import { projects, tickets, comments, activityLogs, users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

export const projectRoutes = new Hono();

// GET /api/projects
projectRoutes.get("/", async (c) => {
  const all = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      ownerId: projects.ownerId,
      createdAt: projects.createdAt,
      ownerName: users.name,
      ownerEmail: users.email,
    })
    .from(projects)
    .leftJoin(users, eq(projects.ownerId, users.id));

  const formatted = all.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    ownerId: p.ownerId,
    createdAt: p.createdAt,
    owner: {
      id: p.ownerId,
      name: p.ownerName ?? "Owner",
      email: p.ownerEmail ?? "",
    },
  }));

  return c.json(formatted);
});

// POST /api/projects
projectRoutes.post("/", async (c) => {
  const user = c.get("user") as JwtPayload;
  const { name, description } = await c.req.json();

  const [project] = await db
    .insert(projects)
    .values({ name, description, ownerId: user.sub })
    .returning();

  return c.json(project, 201);
});

// GET /api/projects/:id
projectRoutes.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) return c.json({ error: "Not found" }, 404);
  return c.json(project);
});

// DELETE /api/projects/:id (Hanya Admin atau Owner Project)
projectRoutes.delete("/:id", async (c) => {
  const user = c.get("user") as JwtPayload;
  const id = Number(c.req.param("id"));

  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) return c.json({ error: "Project not found" }, 404);

  // Check authorization: Admin or Project Owner
  if (user.role !== "admin" && project.ownerId !== user.sub) {
    return c.json({ error: "Forbidden: Hanya admin atau owner yang dapat menghapus project ini" }, 403);
  }

  // Cascading delete: comments -> activityLogs -> tickets -> projects
  const projectTickets = await db.select({ id: tickets.id }).from(tickets).where(eq(tickets.projectId, id));

  for (const t of projectTickets) {
    await db.delete(comments).where(eq(comments.ticketId, t.id));
    await db.delete(activityLogs).where(eq(activityLogs.ticketId, t.id));
  }

  await db.delete(tickets).where(eq(tickets.projectId, id));
  await db.delete(projects).where(eq(projects.id, id));

  return c.json({ ok: true });
});
