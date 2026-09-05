import { NextResponse } from "next/server";
import { ApiError, serverApi, toAbsoluteUrl } from "@/src/features/auth/lib/server-api";
import type { ProfileResponse } from "@/src/features/profile/types/profile";

export async function GET() {
  try {
    const data = await serverApi<ProfileResponse>("/Profile");

    return NextResponse.json({
      ...data,
      data: data.data
        ? { ...data.data, profileImage: toAbsoluteUrl(data.data.profileImage) }
        : data.data,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.status === 401 ? "Not authenticated." : error.message,
          data: null,
          errors: error.errors,
        },
        { status: error.status },
      );
    }

    console.error("GET /api/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the server.",
        data: null,
        errors: null,
      },
      { status: 500 },
    );
  }
}
