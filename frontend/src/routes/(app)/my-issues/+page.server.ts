import type { PageServerLoad, Actions } from "./$types";
import { env } from "$env/dynamic/public";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
  const parentData = await parent();
  const cookie = `token=${cookies.get("token")}`;

  // Ambil semua project
  const projectsRes = await fetch(`${env.PUBLIC_API_URL}/api/projects`, {
    headers: { cookie },
  });
  const projects = projectsRes.ok ? await projectsRes.json() : [];

  // Ambil tiket dari seluruh project
  const ticketPromises = projects.map((p: any) =>
    fetch(`${env.PUBLIC_API_URL}/api/projects/${p.id}/tickets`, {
      headers: { cookie },
    }).then((r) => (r.ok ? r.json() : []))
  );

  const ticketsByProject = await Promise.all(ticketPromises);
  const allTickets = ticketsByProject.flat();

  // Filter khusus tiket yang ditugaskan ke user saat ini
  const myTickets = allTickets.filter((t: any) => t.assigneeId === parentData.user?.id);

  // Ambil data users untuk kebutuhan detail modal
  const usersRes = await fetch(`${env.PUBLIC_API_URL}/api/users`, {
    headers: { cookie },
  });
  const users = usersRes.ok ? await usersRes.json() : [];

  return {
    myTickets,
    projects,
    users,
    currentUser: parentData.user,
  };
};

export const actions: Actions = {
  updateStatus: async ({ request, fetch, cookies }) => {
    const data = await request.formData();
    const ticketId = data.get("ticketId")?.toString();
    const projectId = data.get("projectId")?.toString();
    const status = data.get("status")?.toString();

    if (!ticketId || !projectId || !status) {
      return fail(400, { error: "ticketId, projectId dan status diperlukan" });
    }

    const token = cookies.get("token");
    const res = await fetch(`${env.PUBLIC_API_URL}/api/projects/${projectId}/tickets/${ticketId}`, {
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
