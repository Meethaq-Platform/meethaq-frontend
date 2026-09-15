import type { ProjectStatus } from "@/src/features/projects/types/project";

export interface ProjectInvitation {
  id: number;
  title: string;
  description: string | null;
  status: ProjectStatus;
  freelancerId: number;
  freelancerName: string;
  createdAt: string;
}

export interface ProjectInvitationsListData {
  items: ProjectInvitation[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectInvitationsListResponse {
  success: boolean;
  message: string;
  data: ProjectInvitationsListData | null;
  errors: string[] | null;
}

export interface ProjectInvitationResponse {
  success: boolean;
  message: string;
  data: ProjectInvitation | null;
  errors: string[] | null;
}

export interface ProjectInvitationAcceptance {
  id: number;
  title: string;
  status: ProjectStatus;
  acceptedAt: string;
  acceptedByClientId: number;
  acceptedByClientName: string;
}

export interface ProjectInvitationAcceptanceResponse {
  success: boolean;
  message: string;
  data: ProjectInvitationAcceptance | null;
  errors: string[] | null;
}

export interface GetInvitationsParams {
  pageNumber: number;
  pageSize: number;
  status?: ProjectStatus;
}

export interface GetClientProjectsParams {
  pageNumber: number;
  pageSize: number;
  status?: ProjectStatus;
}
