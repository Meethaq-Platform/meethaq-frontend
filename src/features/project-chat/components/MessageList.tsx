"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";

import { useMessages } from "../hooks/useMessages";
import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import AttachmentList, { type AttachmentListItem } from "@/src/shared/components/AttachmentList";
import RelativeTime from "@/src/shared/components/RelativeTime";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";

interface MessageListProps {
  projectId: string;
}

export function MessageList({ projectId }: MessageListProps) {
  const { data: messages, isLoading, isError, refetch } = useMessages(projectId);
  const { data: currentUser } = useCurrentUser();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages?.length]);

  if (isLoading) {
    return (
      <div className="flex flex-1 justify-center items-center py-16 overflow-y-auto">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 py-16 overflow-y-auto">
        <ErrorState message="Failed to load messages." onRetry={() => refetch()} />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 py-16 overflow-y-auto">
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Start the conversation with your project partner."
        />
      </div>
    );
  }

  // Chronological — oldest first, newest at the bottom.
  const sorted = [...messages].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
  );

  return (
    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
      {sorted.map((message) => {
        const isOwnMessage = message.senderId === currentUser?.id;
        const attachments: AttachmentListItem[] = message.attachments.map((attachment) => ({
          id: attachment.attachmentId,
          fileName: attachment.fileName,
          fileUrl: `/api/projects/${projectId}/messages/${message.messageId}/attachments/${attachment.attachmentId}`,
          fileSizeBytes: attachment.fileSizeBytes,
          contentType: attachment.contentType,
        }));

        return (
          <div
            key={message.messageId}
            className={`flex flex-col gap-1 ${isOwnMessage ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                isOwnMessage
                  ? "bg-primary text-on-primary"
                  : "bg-surface-muted text-text-primary"
              }`}
            >
              {!isOwnMessage && (
                <p className="mb-0.5 font-semibold text-xs opacity-80">
                  {message.senderName}
                </p>
              )}
              {message.content && (
                <p dir="auto" className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
              {attachments.length > 0 && (
                <div className={message.content ? "mt-2" : ""}>
                  <AttachmentList attachments={attachments} />
                </div>
              )}
            </div>
            <RelativeTime value={message.sentAt} className="px-1 text-text-secondary text-xs" />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
