export interface CurrentUser {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
  roles: string[];
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: CurrentUser;
  errors: string[] | null;
}
