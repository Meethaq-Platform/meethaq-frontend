export interface Profile {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  userRole: string;
  country: string;
  professionalTitle: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
  errors: string[] | null;
}
