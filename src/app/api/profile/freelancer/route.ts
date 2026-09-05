import { NextResponse } from "next/server";
import { ApiError, serverApi, toAbsoluteUrl } from "@/src/features/auth/lib/server-api";
import type { ProfileResponse } from "@/src/features/profile/types/profile";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const data = await serverApi<ProfileResponse>("/Profile/freelancer", {
      method: "PUT",
      body: JSON.stringify(body),
    });

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

    console.error("PUT /api/profile/freelancer error:", error);

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
