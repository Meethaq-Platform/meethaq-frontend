// Best-guess casing (see milestones/types/milestone.ts's note on
// executionStatus) — swagger types eventType as a plain string. Used only
// for icon selection in NotificationRow, which falls back to a default icon
// for any unrecognized value, so a casing mismatch degrades gracefully.
export type NotificationEventType =
  | "NewProjectMessage"
  | "MilestoneSubmitted"
  | "RevisionRequested"
  | "DeliverableAccepted"
  | "MilestoneDeadlineApproaching"
  | "ReviewDeadlineApproaching"
  | "ReviewOverdue";

// Mirrors InAppNotificationDto. There is no projectTitle field — the
// server-rendered title/message are expected to carry enough context on
// their own (e.g. "Sarah submitted 'Homepage design' for review").
export interface Notification {
  notificationId: number;
  eventType: string;
  title: string;
  message: string;
  projectId: number;
  milestoneId: number | null;
  isRead: boolean;
  readAt: string | null;
  actionUrl: string;
  createdAt: string;
}

// Cursor-paginated — NotificationInboxCursorDto. unreadCount rides on the
// same response as items, so one polling query drives both the bell badge
// and the open dropdown panel.
export interface NotificationListData {
  items: Notification[];
  unreadCount: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: NotificationListData | null;
  errors: string[] | null;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification | null;
  errors: string[] | null;
}
