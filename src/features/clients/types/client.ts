export interface Client {
  relationshipId: number;
  clientFullName: string;
  clientEmail: string;
  clientPhoneNumber: string | null;
  clientProfileImage: string | null;
  clientCountry: string | null;
  companyName: string | null;
  notes: string | null;
  dateAdded: string;
  updatedAt: string;
}

export interface ClientsListData {
  items: Client[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ClientsListResponse {
  success: boolean;
  message: string;
  data: ClientsListData | null;
  errors: string[] | null;
}

export interface GetClientsParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
}

export interface CreateClientRequest {
  email: string;
  companyName?: string;
  notes?: string;
}

// Narrower than Client — the backend only returns what it knows right after
// linking the relationship (no phone/image/country/updatedAt yet).
export interface CreateClientResult {
  relationshipId: number;
  clientFullName: string;
  clientEmail: string;
  companyName: string | null;
  notes: string | null;
  dateAdded: string;
}

export interface CreateClientResponse {
  success: boolean;
  message: string;
  data: CreateClientResult;
  errors: string[] | null;
}
