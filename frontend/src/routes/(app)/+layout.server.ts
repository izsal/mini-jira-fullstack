import { isRedirect, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { env } from "$env/dynamic/public";

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(303, "/login");
  }

  try {
    const res = await fetch(`${env.PUBLIC_API_URL}/api/auth/me`, {
      headers: { cookie: `token=${token}` },
    });

    if (!res.ok) {
      cookies.delete("token", { path: "/" });
      throw redirect(303, "/login");
    }

    const user = await res.json();
    return { user };
  } catch (err) {
    if (isRedirect(err)) {
      throw err;
    }
    cookies.delete("token", { path: "/" });
    throw redirect(303, "/login");
  }
};
