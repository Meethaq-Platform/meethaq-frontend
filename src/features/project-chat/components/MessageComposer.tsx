"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import {
  chatMessageFormSchema,
  type ChatMessageFormInput,
  type ChatMessageFormValues,
} from "../schemas/message.schema";
import { useSendMessage } from "../hooks/useSendMessage";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface MessageComposerProps {
  projectId: string;
}

export function MessageComposer({ projectId }: MessageComposerProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChatMessageFormInput, unknown, ChatMessageFormValues>({
    resolver: zodResolver(chatMessageFormSchema),
    defaultValues: { content: "", files: [] },
  });

  const files = watch("files") ?? [];
  const sendMessage = useSendMessage(projectId);

  const onSubmit = (values: ChatMessageFormValues) => {
    sendMessage.mutate(
      { content: values.content, files: values.files },
      { onSuccess: () => reset({ content: "", files: [] }) },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 shrink-0 p-4 border-border border-t"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Textarea
            rows={2}
            placeholder="Write a message..."
            {...register("content")}
          />
          <InputError message={errors.content?.message} />
        </div>

        <FileAttachmentInput
          files={files}
          onChange={(next) => setValue("files", next, { shouldValidate: true })}
          maxFiles={5}
        />

        <button
          type="submit"
          disabled={sendMessage.isPending}
          aria-label="Send message"
          className="flex justify-center items-center bg-primary hover:opacity-90 disabled:opacity-60 rounded-xl w-11 h-11 text-white transition disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>

      {sendMessage.isError && (
        <InputError
          message={getErrorMessage(
            sendMessage.error,
            "Failed to send message.",
          )}
        />
      )}
    </form>
  );
}
