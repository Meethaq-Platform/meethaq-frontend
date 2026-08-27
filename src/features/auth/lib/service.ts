import { api } from "./api";
import { RegisterRequest, RegisterResponse } from "../types/register";

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return api<RegisterResponse>("/Auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function loginUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  return api<RegisterResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
