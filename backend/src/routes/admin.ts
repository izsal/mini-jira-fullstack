import { Hono } from "hono";
import { db } from "../db/client";
import { projects, tickets, users, comments, activityLogs } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import type { JwtPayload } from "../middleware/auth";

export const adminRoutes = new Hono();

// GET /api/admin/stats - data statistik menyeluruh untuk Admin Dashboard
adminRoutes.get("/stats", async (c) => {
  const currentUser = c.get("user") as JwtPayload;
  if (currentUser.role !== "admin") {
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }

  // Fetch all core datasets
  const [allProjects, allTickets, allUsers, allComments, recentLogs] = await Promise.all([
    db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        createdAt: projects.createdAt,
      })
      .from(projects),

    db
      .select({
        id: tickets.id,
        projectId: tickets.projectId,
        title: tickets.title,
        status: tickets.status,
        assigneeId: tickets.assigneeId,
        createdAt: tickets.createdAt,
      })
      .from(tickets),

    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users),

    db.select({ id: comments.id }).from(comments),

    db
      .select({
        id: activityLogs.id,
        ticketId: activityLogs.ticketId,
        actorId: activityLogs.actorId,
        action: activityLogs.action,
        meta: activityLogs.meta,
        createdAt: activityLogs.createdAt,
        actorName: users.name,
        actorEmail: users.email,
        ticketTitle: tickets.title,
      })
      .from(activityLogs)
      .leftJoin(users, eq(activityLogs.actorId, users.id))
      .leftJoin(tickets, eq(activityLogs.ticketId, tickets.id))
      .orderBy(desc(activityLogs.createdAt))
      .limit(10),
  ]);

  const totalProjects = allProjects.length;
  const totalTickets = allTickets.length;
  const todoTickets = allTickets.filter((t) => t.status === "todo").length;
  const inProgressTickets = allTickets.filter((t) => t.status === "in_progress").length;
  const doneTickets = allTickets.filter((t) => t.status === "done").length;
  const completionRate = totalTickets > 0 ? Math.round((doneTickets / totalTickets) * 100) : 0;

  const totalUsers = allUsers.length;
  const totalAdmins = allUsers.filter((u) => u.role === "admin").length;
  const totalMembers = totalUsers - totalAdmins;
  const totalComments = allComments.length;

  // Project progress breakdown
  const projectsOverview = allProjects.map((p) => {
    const projTickets = allTickets.filter((t) => t.projectId === p.id);
    const pTotal = projTickets.length;
    const pDone = projTickets.filter((t) => t.status === "done").length;
    const pRate = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0;
    return {
      ...p,
      ticketCount: pTotal,
      doneCount: pDone,
      completionRate: pRate,
    };
  });

  // Team members workload
  const teamWorkload = allUsers.map((u) => {
    const userTickets = allTickets.filter((t) => t.assigneeId === u.id);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      assignedCount: userTickets.length,
      inProgressCount: userTickets.filter((t) => t.status === "in_progress").length,
      doneCount: userTickets.filter((t) => t.status === "done").length,
    };
  });

  return c.json({
    metrics: {
      totalProjects,
      totalTickets,
      todoTickets,
      inProgressTickets,
      doneTickets,
      completionRate,
      totalUsers,
      totalAdmins,
      totalMembers,
      totalComments,
    },
    projectsOverview,
    teamWorkload,
    recentActivity: recentLogs,
  });
});
