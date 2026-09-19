import type { ChatMessageListResponse } from "../types/message";

// Cursor-paginated on the backend — no cursor passed fetches the first page.
export async function getMessages(projectId: string): Promise<ChatMessageListResponse> {
  const response = await fetch(`/api/projects/${projectId}/messages?pageSize=50`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load messages.");
  }

  return result;
}

export interface SendMessagePayload {
  content: string;
  files: File[];
}

// Field names match the multipart binding exactly: Content, Files.
export async function sendMessage(projectId: string, data: SendMessagePayload) {
  const formData = new FormData();
  formData.set("Content", data.content);
  for (const file of data.files) {
    formData.append("Files", file);
  }

  const response = await fetch(`/api/projects/${projectId}/messages`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send message.");
  }

  return result;
}
