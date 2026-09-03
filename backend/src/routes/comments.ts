import { Hono } from "hono";
import { db } from "../db/client";
import { comments, users, activityLogs } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

export const commentRoutes = new Hono();

// GET /api/tickets/:ticketId/comments
commentRoutes.get("/", async (c) => {
  const ticketId = Number(c.req.param("ticketId"));

  const all = await db
    .select({
      id: comments.id,
      ticketId: comments.ticketId,
      authorId: comments.authorId,
      body: comments.body,
      createdAt: comments.createdAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.ticketId, ticketId))
    .orderBy(asc(comments.createdAt));

  const formatted = all.map((item) => ({
    id: item.id,
    ticketId: item.ticketId,
    authorId: item.authorId,
    body: item.body,
    createdAt: item.createdAt,
    author: {
      id: item.authorId,
      name: item.authorName ?? "Unknown User",
      email: item.authorEmail ?? "",
    },
  }));

  return c.json(formatted);
});

// POST /api/tickets/:ticketId/comments
commentRoutes.post("/", async (c) => {
  const user = c.get("user") as JwtPayload;
  const ticketId = Number(c.req.param("ticketId"));
  const { body } = await c.req.json();

  if (!body || !body.trim()) {
    return c.json({ error: "Comment body cannot be empty" }, 400);
  }

  const [comment] = await db
    .insert(comments)
    .values({ ticketId, authorId: user.sub, body: body.trim() })
    .returning();

  await db.insert(activityLogs).values({
    ticketId,
    actorId: user.sub,
    action: "comment_added",
  });

  // Fetch author details to return full object
  const author = await db.query.users.findFirst({
    where: eq(users.id, user.sub),
  });

  return c.json(
    {
      ...comment,
      author: {
        id: user.sub,
        name: author?.name ?? "User",
        email: author?.email ?? "",
      },
    },
    201
  );
});
