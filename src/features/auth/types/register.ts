export type UserRole = "freelancer" | "client";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}

export type RegisterResponseData = AuthUser;

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterResponseData | null;
  errors: string[] | null;
}
