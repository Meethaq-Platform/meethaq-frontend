import { NextResponse } from "next/server";
import { ApiError, serverApi } from "@/src/features/auth/lib/server-api";

export async function GET() {
  try {
    const data = await serverApi("/Profile");

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
          data: null,
          errors: null,
        },
        { status: 401 },
      );
    }

    console.error("GET /api/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to the server.",
        data: null,
        errors: null,
      },
      { status: 500 },
    );
  }
}
