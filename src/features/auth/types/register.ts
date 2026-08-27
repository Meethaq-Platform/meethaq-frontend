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

export interface RegisterResponseData extends AuthUser {
  token: string;
  refreshToken: string;
  refreshTokenExpiration: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterResponseData | null;
  errors: string[] | null;
}
