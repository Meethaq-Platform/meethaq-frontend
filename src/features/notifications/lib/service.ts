import type { NotificationListResponse } from "../types/notification";

// Cursor-paginated — no cursor passed fetches the first page.
export async function getNotifications(
  cursor?: string,
): Promise<NotificationListResponse> {
  const params = new URLSearchParams({ pageSize: "20" });
  if (cursor) params.set("cursor", cursor);

  const response = await fetch(`/api/notifications?${params.toString()}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load notifications.");
  }

  return result;
}

export async function markNotificationRead(notificationId: number): Promise<{
  success: boolean;
  message: string;
  data: boolean;
  errors: string[] | null;
}> {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: "PUT",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to mark notification as read.");
  }

  return result;
}

export async function markAllNotificationsRead(): Promise<{
  success: boolean;
  message: string;
  data: number;
  errors: string[] | null;
}> {
  const response = await fetch("/api/notifications/read-all", { method: "PUT" });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to mark all notifications as read.");
  }

  return result;
}
