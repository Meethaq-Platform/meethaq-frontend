import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Registration failed.",
          errors: data.errors ?? null,
        },
        { status: response.status },
      );
    }

    const responseData = data.data;

    return NextResponse.json({
      success: true,
      message: data.message,
      data: {
        email: responseData.email,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        roles: responseData.roles,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the server.",
      },
      { status: 500 },
    );
  }
}
