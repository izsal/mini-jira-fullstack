import { Hono } from "hono";
import { db } from "../db/client";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

export const projectRoutes = new Hono();

projectRoutes.get("/", async (c) => {
  const all = await db.select().from(projects);
  return c.json(all);
});

projectRoutes.post("/", async (c) => {
  const user = c.get("user") as JwtPayload;
  const { name, description } = await c.req.json();

  const [project] = await db
    .insert(projects)
    .values({ name, description, ownerId: user.sub })
    .returning();

  return c.json(project, 201);
});

projectRoutes.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const project = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!project) return c.json({ error: "Not found" }, 404);
  return c.json(project);
});

projectRoutes.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await db.delete(projects).where(eq(projects.id, id));
  return c.json({ ok: true });
});
