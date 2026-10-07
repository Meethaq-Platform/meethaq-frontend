import "server-only";

import { NextResponse } from "next/server";

import { errorResponse, serverApi } from "./server-api";

type ProxyMethod = "GET" | "POST" | "PUT" | "DELETE";

// Success status per method. serverApi() collapses any backend 2xx into the
// parsed body, so the BFF picks the status itself — 200 unless the route has
// always answered 201.
type MethodStatuses = Partial<Record<ProxyMethod, 200 | 201>>;

// Every backend path the catch-all may reach. Anything not listed here 404s,
// so the browser can't use the BFF to hit arbitrary backend endpoints. Routes
// with real logic (auth, profile image URLs, file downloads, ...) keep their
// own route.ts, which Next matches before the catch-all.
const ROUTES: Record<string, MethodStatuses> = {
  "client/dashboard": { GET: 200 },
  "client/dashboard/financial-trend": { GET: 200 },
  "client/dashboard/payment-follow-up": { GET: 200 },
  "client/invitations": { GET: 200 },
  "client/invitations/[id]": { GET: 200 },
  "client/invitations/[id]/accept": { POST: 200 },
  "client/projects": { GET: 200 },
  "client/projects/[id]": { GET: 200 },
  "client/projects/[id]/contract": { GET: 200 },
  "client/projects/[id]/contract/approve": { POST: 200 },
  "client/projects/[id]/contract/feedback": { GET: 200 },
  "client/projects/[id]/contract/request-changes": { POST: 200 },
  "client/projects/[id]/milestones/[milestoneId]": { GET: 200 },
  "client/projects/[id]/milestones/[milestoneId]/accept": { POST: 200 },
  "client/projects/[id]/milestones/[milestoneId]/payments": { POST: 201 },
  "client/projects/[id]/milestones/[milestoneId]/payments/corrected-evidence": { POST: 200 },
  "client/projects/[id]/milestones/[milestoneId]/request-revision": { POST: 200 },
  "client/projects/[id]/milestones/[milestoneId]/submissions": { GET: 200 },

  "freelancer/dashboard": { GET: 200 },
  "freelancer/dashboard/financial-trend": { GET: 200 },
  "freelancer/dashboard/payment-follow-up": { GET: 200 },

  notifications: { GET: 200 },
  "notifications/read-all": { PUT: 200 },
  "notifications/[notificationId]/read": { PUT: 200 },

  projects: { GET: 200, POST: 201 },
  "projects/[id]": { GET: 200, PUT: 200 },
  "projects/[id]/activity": { GET: 200 },
  "projects/[id]/cancel": { POST: 200 },
  "projects/[id]/change-requests": { GET: 200, POST: 201 },
  "projects/[id]/change-requests/[changeRequestId]": { GET: 200 },
  "projects/[id]/change-requests/[changeRequestId]/decide": { POST: 200 },
  "projects/[id]/change-requests/[changeRequestId]/withdraw": { POST: 200 },
  "projects/[id]/client": { PUT: 200, DELETE: 200 },
  "projects/[id]/complete": { POST: 200 },
  "projects/[id]/contract": { GET: 200, POST: 201, PUT: 200, DELETE: 200 },
  "projects/[id]/contract/amendments": { GET: 200 },
  "projects/[id]/contract/amendments/[amendmentId]": { GET: 200 },
  "projects/[id]/contract/milestones": { POST: 201 },
  "projects/[id]/contract/milestones/reorder": { PUT: 200 },
  "projects/[id]/contract/milestones/[milestoneId]": { PUT: 200, DELETE: 200 },
  "projects/[id]/contract/submit": { POST: 200 },
  "projects/[id]/contract/validate": { POST: 200 },
  "projects/[id]/contract/withdraw": { POST: 200 },
  "projects/[id]/disputes": { GET: 200 },
  "projects/[id]/messages": { GET: 200, POST: 201 },
  "projects/[id]/milestones/[milestoneId]": { GET: 200 },
  "projects/[id]/milestones/[milestoneId]/disputes": { POST: 201 },
  "projects/[id]/milestones/[milestoneId]/disputes/[disputeId]": { GET: 200 },
  "projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/decide-resolution": { POST: 200 },
  "projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/evidence": { POST: 201 },
  "projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/proposals": { POST: 201 },
  "projects/[id]/milestones/[milestoneId]/disputes/[disputeId]/withdraw": { POST: 200 },
  "projects/[id]/milestones/[milestoneId]/payments": { GET: 200 },
  "projects/[id]/milestones/[milestoneId]/payments/confirm": { POST: 200 },
  "projects/[id]/milestones/[milestoneId]/payments/report-issue": { POST: 200 },
  "projects/[id]/milestones/[milestoneId]/start": { POST: 200 },
  "projects/[id]/milestones/[milestoneId]/submissions": { GET: 200, POST: 201 },
  "projects/[id]/overview": { GET: 200 },
  "projects/[id]/payments/summary": { GET: 200 },
};

const isParam = (part: string) => part.startsWith("[");

// Ordered like Next's own routing: at the first segment where two patterns
// differ, the static one wins (".../milestones/reorder" before
// ".../milestones/[milestoneId]").
const PATTERNS = Object.keys(ROUTES)
  .map((pattern) => pattern.split("/"))
  .sort((a, b) => {
    const rank = (parts: string[]) => parts.map((p) => (isParam(p) ? "1" : "0")).join("");
    return rank(a).localeCompare(rank(b));
  });

// A "[param]" pattern segment matches any single path segment except the
// dot segments, which fetch() would resolve into a different backend path.
function matchRoute(path: string[]): string | null {
  const match = PATTERNS.find(
    (pattern) =>
      pattern.length === path.length &&
      pattern.every((part, i) =>
        isParam(part)
          ? path[i] !== "" && path[i] !== "." && path[i] !== ".."
          : part === path[i],
      ),
  );

  return match ? match.join("/") : null;
}

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json(
    { success: false, message, data: null, errors: null },
    { status, headers },
  );
}

// Forwards an allowlisted request through serverApi(), so auth, the one-shot
// token refresh and the error mapping are exactly what the per-route handlers
// did. The body is buffered as raw bytes rather than streamed: serverApi()
// replays the request after a 401 refresh, and a consumed stream can't be
// sent twice. Raw bytes keep multipart uploads intact, boundary included.
export async function proxyToBackend(
  request: Request,
  path: string[],
): Promise<Response> {
  const pattern = matchRoute(path);

  if (!pattern) {
    return jsonError("Not found.", 404);
  }

  const method = request.method as ProxyMethod;
  const statuses = ROUTES[pattern];
  const successStatus = statuses[method];

  if (successStatus === undefined) {
    return jsonError("Method not allowed.", 405, {
      Allow: Object.keys(statuses).join(", "),
    });
  }

  const { search } = new URL(request.url);
  const endpoint = `/${path.map(encodeURIComponent).join("/")}${search}`;

  const body = method === "GET" ? null : await request.arrayBuffer();
  const contentType = request.headers.get("Content-Type");

  // Without a body, serverApi() sends its JSON default, as the old handlers did.
  const options: RequestInit =
    body && body.byteLength > 0
      ? { method, body, headers: contentType ? { "Content-Type": contentType } : {} }
      : { method };

  try {
    const data = await serverApi(endpoint, options);

    return NextResponse.json(data, { status: successStatus });
  } catch (error) {
    return errorResponse(error, `${method} /api/${pattern}`);
  }
}
