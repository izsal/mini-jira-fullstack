import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { ticketRoutes } from "./routes/tickets";
import { commentRoutes } from "./routes/comments";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

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
app.use("/api/projects/*", authMiddleware);
app.route("/api/projects", projectRoutes);
app.route("/api/projects/:projectId/tickets", ticketRoutes);
app.route("/api/tickets/:ticketId/comments", commentRoutes);

export default {
  port: process.env.PORT ?? 3000,
  fetch: app.fetch,
};
