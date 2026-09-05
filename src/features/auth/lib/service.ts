import { RegisterRequest, RegisterResponse } from "../types/register";
import { LoginRequest, LoginResponse } from "../types/login";
import { MeResponse } from "../types/me";

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed.");
  }

  return result;
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

export async function logoutUser() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Logout failed.");
  }

  return result;
}

export async function getCurrentUser(): Promise<MeResponse> {
  const response = await fetch("/api/auth/me");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get current user.");
  }

  return data;
}
