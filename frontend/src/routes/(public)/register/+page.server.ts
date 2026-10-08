import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { env } from "$env/dynamic/public";

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const password = data.get("password")?.toString();

    if (!name || !email || !password) {
      return fail(400, { error: "Semua field harus diisi" });
    }

    if (password.length < 6) {
      return fail(400, { error: "Password minimal harus 6 karakter" });
    }

    // Call backend POST /api/auth/register
    const res = await fetch(`${env.PUBLIC_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json();
      return fail(res.status, { error: body.error ?? "Pendaftaran gagal" });
    }

    // Auto-login after successful registration
    const loginRes = await fetch(`${env.PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.ok) {
      const setCookie = loginRes.headers.get("set-cookie");
      if (setCookie) {
        const match = setCookie.match(/token=([^;]+)/);
        if (match) {
          cookies.set("token", match[1], {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            domain: ".qwarts.my.id",
            maxAge: 60 * 60 * 24 * 7,
          });
        }
      }
      throw redirect(303, "/projects");
    }

    throw redirect(303, "/login?registered=true");
  },
};
