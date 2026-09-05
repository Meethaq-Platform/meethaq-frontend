import { NextResponse } from "next/server";
import {
  ApiError,
  serverApi,
  toAbsoluteUrl,
} from "@/src/features/auth/lib/server-api";
import type { ClientsListResponse } from "@/src/features/clients/types/client";

export async function GET(request: Request) {
  const { search } = new URL(request.url);

  try {
    const data = await serverApi<ClientsListResponse>(`/clients${search}`);

    return NextResponse.json({
      ...data,
      data: data.data
        ? {
            ...data.data,
            items: data.data.items.map((item) => ({
              ...item,
              clientProfileImage: toAbsoluteUrl(item.clientProfileImage),
            })),
          }
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

    console.error("GET /api/clients error:", error);

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
