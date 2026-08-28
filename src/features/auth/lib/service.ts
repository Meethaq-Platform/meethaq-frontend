import { api } from "./api";
import { RegisterRequest, RegisterResponse } from "../types/register";
import { LoginRequest, LoginResponse } from "../types/login";

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return api<RegisterResponse>("/Auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  console.log("Backend login response:", result);

  if (!response.ok) {
    throw new Error(result.message || "Login failed.");
  }

  return result;
}
