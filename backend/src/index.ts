import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { ticketRoutes } from "./routes/tickets";
import { commentRoutes } from "./routes/comments";
import { userRoutes } from "./routes/users";
import { adminRoutes } from "./routes/admin";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

// Request logging di terminal
app.use("*", logger());

app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  })
);

app.get("/health", (c) => c.json({ ok: true }));

// Public
app.route("/api/auth", authRoutes);

// Protected (semua route di bawah ini butuh cookie "token")
app.use("/api/projects", authMiddleware);
app.use("/api/projects/*", authMiddleware);
app.use("/api/tickets/*", authMiddleware);
app.use("/api/users", authMiddleware);
app.use("/api/users/*", authMiddleware);
app.use("/api/admin", authMiddleware);
app.use("/api/admin/*", authMiddleware);

app.route("/api/projects", projectRoutes);
app.route("/api/projects/:projectId/tickets", ticketRoutes);
app.route("/api/tickets/:ticketId/comments", commentRoutes);
app.route("/api/users", userRoutes);
app.route("/api/admin", adminRoutes);

export default {
  port: process.env.PORT ?? 3000,
  fetch: app.fetch,
};
