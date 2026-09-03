import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
  const parentData = await parent();

  // Guard: Hanya admin yang dapat mengakses
  if (parentData.user?.role !== "admin") {
    throw redirect(303, "/projects");
  }

  const cookie = `token=${cookies.get("token")}`;
  const res = await fetch(`${env.PUBLIC_API_URL}/api/users`, {
    headers: { cookie },
  });

  const users = res.ok ? await res.json() : [];
  return { users, currentUser: parentData.user };
};

export const actions: Actions = {
  toggleRole: async ({ request, fetch, cookies }) => {
    const token = cookies.get("token");
    if (!token) {
      return fail(401, { error: "Unauthorized" });
    }

    const meRes = await fetch(`${env.PUBLIC_API_URL}/api/auth/me`, {
      headers: { cookie: `token=${token}` },
    });
    if (!meRes.ok) {
      return fail(401, { error: "Unauthorized" });
    }
    const currentUser = await meRes.json();

    if (currentUser.role !== "admin") {
      return fail(403, { error: "Hanya admin yang berhak mengubah role" });
    }

    const data = await request.formData();
    const targetUserId = data.get("userId")?.toString();
    const newRole = data.get("newRole")?.toString();

    if (!targetUserId || (newRole !== "admin" && newRole !== "user")) {
      return fail(400, { error: "Parameter userId dan newRole tidak valid" });
    }

    // Mencegah admin mencabut role diri sendiri agar tidak terkunci
    if (Number(targetUserId) === currentUser.id && newRole !== "admin") {
      return fail(400, { error: "Anda tidak dapat mencabut hak administrator akun Anda sendiri" });
    }

    const res = await fetch(`${env.PUBLIC_API_URL}/api/users/${targetUserId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: `token=${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return fail(res.status, { error: body.error ?? "Gagal mengubah role user" });
    }

    return { success: true };
  },
};
