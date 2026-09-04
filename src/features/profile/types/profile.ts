export interface Profile {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
  userRole: string;
  country: string | null;
  professionalTitle?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
  errors: string[] | null;
}

export interface UpdateFreelancerProfileRequest {
  fullName: string;
  phoneNumber: string;
  profileImage?: string;
  country?: string;
  professionalTitle: string;
  bio?: string;
}

export interface UpdateClientProfileRequest {
  fullName: string;
  phoneNumber: string;
  profileImage?: string;
  country?: string;
}
