import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
  const parentData = await parent();

  // Guard: Hanya admin yang dapat mengakses
  if (parentData.user?.role !== "admin") {
    throw redirect(303, "/projects");
  }

  const cookie = `token=${cookies.get("token")}`;
  const res = await fetch(`${env.PUBLIC_API_URL}/api/admin/stats`, {
    headers: { cookie },
  });

  if (!res.ok) {
    return {
      stats: null,
      currentUser: parentData.user,
    };
  }

  const stats = await res.json();
  return { stats, currentUser: parentData.user };
};
