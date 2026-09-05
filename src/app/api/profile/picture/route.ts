import { NextResponse } from "next/server";
import { ApiError, serverApi, toAbsoluteUrl } from "@/src/features/auth/lib/server-api";
import type { UpdateProfilePictureResponse } from "@/src/features/profile/types/profile";

function errorResponse(error: unknown, logLabel: string) {
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

  console.error(logLabel, error);

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data = await serverApi<UpdateProfilePictureResponse>(
      "/Profile/picture",
      {
        method: "POST",
        body: formData,
      },
    );

    return NextResponse.json({
      ...data,
      data: data.data
        ? {
            ...data.data,
            profileImageUrl:
              toAbsoluteUrl(data.data.profileImageUrl) ??
              data.data.profileImageUrl,
          }
        : data.data,
    });
  } catch (error) {
    return errorResponse(error, "POST /api/profile/picture error:");
  }
}

export async function DELETE() {
  try {
    const data = await serverApi("/Profile/picture", { method: "DELETE" });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "DELETE /api/profile/picture error:");
  }
}
