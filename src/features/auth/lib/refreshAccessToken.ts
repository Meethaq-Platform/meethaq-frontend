import "server-only";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL;

export async function refreshAccessToken(): Promise<boolean> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return false;
  }

  const response = await fetch(`${API_URL}/Auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken,
      refreshToken,
    }),
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();

  if (!data.success || !data.data) {
    return false;
  }

  const {
    token,
    refreshToken: newRefreshToken,
    refreshTokenExpiration,
  } = data.data;

  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(refreshTokenExpiration),
  });

  return true;
}
