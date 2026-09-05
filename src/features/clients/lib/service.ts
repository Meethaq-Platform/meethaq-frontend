import type {
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

export async function createClient(
  data: CreateClientRequest,
): Promise<CreateClientResponse> {
  const response = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add client.");
  }

  return result;
}
