import { NextResponse } from "next/server";
import {
  ApiError,
  serverApi,
} from "@/src/features/auth/lib/server-api";
import type { PaymentFollowUpResponse } from "@/src/features/dashboard/types/dashboard";

export async function GET(request: Request) {
  const { search } = new URL(request.url);

  try {
    const data = await serverApi<PaymentFollowUpResponse>(
      `/client/dashboard/payment-follow-up${search}`,
    );

    return NextResponse.json(data);
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

    console.error("GET /api/client/dashboard/payment-follow-up error:", error);

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
