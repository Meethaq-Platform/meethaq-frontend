import type {
  Client,
  ClientsListResponse,
  CreateClientRequest,
  CreateClientResponse,
  GetClientsParams,
} from "../types/client";

export async function getClients(
  params: GetClientsParams,
): Promise<ClientsListResponse> {
  const query = new URLSearchParams();
  query.set("PageNumber", String(params.pageNumber));
  query.set("PageSize", String(params.pageSize));
  if (params.search) query.set("Search", params.search);
  if (params.sortBy) query.set("SortBy", params.sortBy);

  const response = await fetch(`/api/clients?${query.toString()}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load clients.");
  }

  return data;
}

let mockRelationshipId = -1;

export async function createClient(
  data: CreateClientRequest,
): Promise<CreateClientResponse> {
  const newClient: Client = {
    relationshipId: mockRelationshipId--,
    clientFullName: data.fullName,
    clientEmail: data.email,
    clientPhoneNumber: null,
    clientProfileImage: null,
    clientCountry: null,
    companyName: data.companyName?.trim() ? data.companyName.trim() : null,
    notes: null,
    dateAdded: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: true,
          message: "Client added successfully.",
          data: newClient,
          errors: null,
        }),
      400,
    ),
  );
}
