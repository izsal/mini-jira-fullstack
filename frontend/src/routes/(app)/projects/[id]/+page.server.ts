import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";

export const load: PageServerLoad = async ({ params, fetch, cookies, parent }) => {
  await parent();

  const cookie = `token=${cookies.get("token")}`;

  const [ticketsRes, usersRes] = await Promise.all([
    fetch(`${env.PUBLIC_API_URL}/api/projects/${params.id}/tickets`, {
      headers: { cookie },
    }),
    fetch(`${env.PUBLIC_API_URL}/api/users`, {
      headers: { cookie },
    }),
  ]);

  const tickets = ticketsRes.ok ? await ticketsRes.json() : [];
  const users = usersRes.ok ? await usersRes.json() : [];

  return { tickets, projectId: params.id, users };
};

export const actions: Actions = {
  createTicket: async ({ params, request, fetch, cookies }) => {
    const data = await request.formData();
    const title = data.get("title")?.toString().trim();
    const description = data.get("description")?.toString().trim();
    const status = data.get("status")?.toString().trim() || "todo";
    const assigneeId = data.get("assigneeId")?.toString().trim();

    if (!title) {
      return fail(400, { error: "Judul tiket wajib diisi" });
    }

    const token = cookies.get("token");
    const res = await fetch(`${env.PUBLIC_API_URL}/api/projects/${params.id}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `token=${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status,
        assigneeId: assigneeId ? Number(assigneeId) : null,
      }),
    });

    if (res.status === 401) {
      cookies.delete("token", { path: "/" });
      throw redirect(303, "/login");
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return fail(res.status, { error: body.error ?? "Gagal membuat tiket" });
    }

    return { success: true };
  },

  updateStatus: async ({ params, request, fetch, cookies }) => {
    const data = await request.formData();
    const ticketId = data.get("ticketId")?.toString();
    const status = data.get("status")?.toString();

    if (!ticketId || !status) {
      return fail(400, { error: "ticketId dan status diperlukan" });
    }

    const token = cookies.get("token");
    const res = await fetch(`${env.PUBLIC_API_URL}/api/projects/${params.id}/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: `token=${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.status === 401) {
      cookies.delete("token", { path: "/" });
      throw redirect(303, "/login");
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return fail(res.status, { error: body.error ?? "Gagal memindahkan tiket" });
    }

    return { success: true };
  },
};
