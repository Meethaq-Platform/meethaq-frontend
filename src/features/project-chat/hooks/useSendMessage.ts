"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage, type SendMessagePayload } from "../lib/service";

export function useSendMessage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["send-message"],
    // The new message showing up in the thread is the confirmation, and
    // MessageComposer shows send errors inline under the box.
    meta: { suppressToast: true },
    mutationFn: (data: SendMessagePayload) => sendMessage(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", projectId] });
    },
  });
}
