import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
  await parent();

  const token = cookies.get("token");
  const res = await fetch(`${env.PUBLIC_API_URL}/api/projects`, {
    headers: { cookie: `token=${token}` },
  });

  const projects = res.ok ? await res.json() : [];
  return { projects };
};

export const actions: Actions = {
  create: async ({ request, fetch, cookies }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString().trim();
    const description = data.get("description")?.toString().trim();

    if (!name) {
      return fail(400, { error: "Nama project tidak boleh kosong" });
    }

    const token = cookies.get("token");
    const res = await fetch(`${env.PUBLIC_API_URL}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `token=${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.status === 401) {
      cookies.delete("token", { path: "/" });
      throw redirect(303, "/login");
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return fail(res.status, { error: body.error ?? "Gagal membuat project" });
    }

    return { success: true };
  },
};
