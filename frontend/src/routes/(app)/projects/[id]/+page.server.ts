import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/public";

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
  const cookie = `token=${cookies.get("token")}`;
  const res = await fetch(`${env.PUBLIC_API_URL}/api/projects/${params.id}/tickets`, {
    headers: { cookie },
  });
  const tickets = res.ok ? await res.json() : [];
  return { tickets };
};
