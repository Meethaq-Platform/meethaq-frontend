import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.delete({ name: "access_token", path: "/" });
  response.cookies.delete({ name: "refresh_token", path: "/" });

  return response;
}
