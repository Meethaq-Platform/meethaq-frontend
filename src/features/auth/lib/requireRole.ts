import "server-only";

import { redirect } from "next/navigation";

import { ApiError, serverApi } from "./server-api";
import type { MeResponse } from "../types/me";
import type { UserRole } from "../types/register";

// Route-level guard for pages restricted to a single role (e.g. Clients is
// freelancer-only). The (protected) layout only checks that a token cookie
// exists, so this fills the gap by checking who that token actually belongs to.
export async function requireRole(role: UserRole) {
  let me: MeResponse;

  try {
    me = await serverApi<MeResponse>("/Auth/me");
  } catch (error) {
    redirect(error instanceof ApiError && error.status === 401 ? "/login" : "/dashboard");
  }

  const currentRole = me.data.roles[0]?.toLowerCase();

  if (currentRole !== role) {
    redirect("/dashboard");
  }

  return me.data;
}
