export interface LoginRequest {
  emailOrFullName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    refreshToken: string;
    refreshTokenExpiration: string;
  };
  errors: string[] | null;
}
