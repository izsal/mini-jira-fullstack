import { Hono } from "hono";
import { db } from "../db/client";
import { comments, activityLogs } from "../db/schema";
import { eq } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

export const commentRoutes = new Hono();

// GET /api/tickets/:ticketId/comments
commentRoutes.get("/", async (c) => {
  const ticketId = Number(c.req.param("ticketId"));
  const all = await db.select().from(comments).where(eq(comments.ticketId, ticketId));
  return c.json(all);
});

commentRoutes.post("/", async (c) => {
  const user = c.get("user") as JwtPayload;
  const ticketId = Number(c.req.param("ticketId"));
  const { body } = await c.req.json();

  const [comment] = await db
    .insert(comments)
    .values({ ticketId, authorId: user.sub, body })
    .returning();

  await db.insert(activityLogs).values({
    ticketId,
    actorId: user.sub,
    action: "comment_added",
  });

  return c.json(comment, 201);
});
