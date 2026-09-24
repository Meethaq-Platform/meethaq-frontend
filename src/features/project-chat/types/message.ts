export interface ChatAttachment {
  attachmentId: number;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  // Raw backend-relative path — build the BFF-proxied URL
  // (/api/projects/{id}/messages/{messageId}/attachments/{attachmentId})
  // from the ids instead of using this directly.
  downloadUrl: string;
  uploadedAt: string;
}

// Mirrors ProjectMessageDto. senderRole is a plain string on the backend
// (no enum listed) — widened rather than narrowed to "Freelancer"|"Client"
// so an unexpected value doesn't break rendering.
export interface ChatMessage {
  messageId: number;
  projectId: number;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  sentAt: string;
  attachments: ChatAttachment[];
}

export interface ChatMessageResponse {
  success: boolean;
  message: string;
  data: ChatMessage | null;
  errors: string[] | null;
}

// Cursor-paginated — ProjectMessageDtoCursorPaginatedResponse.
export interface ChatMessageListData {
  items: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: number;
}

export interface ChatMessageListResponse {
  success: boolean;
  message: string;
  data: ChatMessageListData | null;
  errors: string[] | null;
}
