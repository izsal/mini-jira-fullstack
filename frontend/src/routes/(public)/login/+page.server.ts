import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { env } from "$env/dynamic/public";

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    const res = await fetch(`${env.PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json();
      return fail(res.status, { error: body.error ?? "Login gagal" });
    }

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      const match = setCookie.match(/token=([^;]+)/);
      if (match) {
        cookies.set("token", match[1], {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    throw redirect(303, "/projects");
  },
};
