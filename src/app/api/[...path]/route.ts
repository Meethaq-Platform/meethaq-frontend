import { proxyToBackend } from "@/src/features/auth/lib/bff-proxy";

// Allowlisted pass-through to the backend for every endpoint that has no
// logic of its own. Routes that do (auth, profile, file downloads, ...) live
// in their own route.ts, which Next matches before this catch-all.
export const dynamic = "force-dynamic";

async function handler(
  request: Request,
  { params }: RouteContext<"/api/[...path]">,
) {
  const { path } = await params;

  return proxyToBackend(request, path);
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
