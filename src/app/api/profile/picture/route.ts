import { NextResponse } from "next/server";
import {
  errorResponse,
  serverApi,
  toAbsoluteUrl,
} from "@/src/features/auth/lib/server-api";
import type { UpdateProfilePictureResponse } from "@/src/features/profile/types/profile";

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
    return errorResponse(error, "POST /api/profile/picture");
  }
}

export async function DELETE() {
  try {
    const data = await serverApi("/Profile/picture", { method: "DELETE" });

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error, "DELETE /api/profile/picture");
  }
}
