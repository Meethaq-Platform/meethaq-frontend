"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage, type SendMessagePayload } from "../lib/service";

export function useSendMessage(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["send-message"],
    mutationFn: (data: SendMessagePayload) => sendMessage(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", projectId] });
    },
  });
}
