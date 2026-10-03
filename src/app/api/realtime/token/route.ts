import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { refreshAccessToken } from "@/src/features/auth/lib/refreshAccessToken";

// Refresh a token this close to expiry instead of handing out one that
// dies mid-negotiate.
const EXPIRY_MARGIN_MS = 60_000;

function expiresSoon(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 - Date.now() < EXPIRY_MARGIN_MS;
  } catch {
    return true;
  }
}

// The SignalR hub lives on the backend's own origin, and a browser WebSocket
// can't carry the httpOnly access_token cookie there (or set an
// Authorization header), so the realtime client asks for the token here and
// passes it as the hub's access_token query parameter. SignalR calls this on
// every connect and reconnect, so a refreshed token is picked up each time.
export async function GET() {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;

  if (accessToken && expiresSoon(accessToken)) {
    accessToken = (await refreshAccessToken())
      ? cookieStore.get("access_token")?.value
      : undefined;
  }

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Not authenticated.", data: null, errors: null },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { success: true, message: "", data: { accessToken }, errors: null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
