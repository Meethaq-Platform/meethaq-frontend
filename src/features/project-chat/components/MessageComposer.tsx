"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import {
  createChatMessageFormSchema,
  MAX_MESSAGE_FILES,
  type ChatMessageFormInput,
  type ChatMessageFormValues,
} from "../schemas/message.schema";
import { useSendMessage } from "../hooks/useSendMessage";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import FileAttachmentInput from "@/src/shared/components/FileAttachmentInput";
import FilePreviewStrip from "@/src/shared/components/FilePreviewStrip";
import { useErrorText } from "@/src/shared/hooks/useApiMessage";

interface MessageComposerProps {
  projectId: string;
}

export function MessageComposer({ projectId }: MessageComposerProps) {
  const t = useTranslations("chat");
  const errorText = useErrorText();
  const tValidation = useTranslations("chat.validation");
  const chatMessageFormSchema = useMemo(
    () => createChatMessageFormSchema(tValidation),
    [tValidation],
  );

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
  const [attachError, setAttachError] = useState<string | null>(null);

  const setFiles = (next: File[]) =>
    setValue("files", next, { shouldValidate: true });

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
      {/* Picked files preview full-width above the message box, the way
          they'll be sent, instead of stacking under the attach button. */}
      <FilePreviewStrip
        files={files}
        onRemove={(index) => {
          setFiles(files.filter((_, i) => i !== index));
          setAttachError(null);
        }}
      />

      {/* Top-aligned with one shared height (h-16), so the buttons line up
          with the message box even when an error appears below it. */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Textarea
            rows={2}
            className="h-16"
            placeholder={t("placeholder")}
            {...register("content")}
            // Enter sends, Shift+Enter keeps the default newline. isComposing
            // skips the Enter that confirms an IME candidate.
            onKeyDown={(event) => {
              if (
                event.key !== "Enter" ||
                event.shiftKey ||
                event.nativeEvent.isComposing
              ) {
                return;
              }
              event.preventDefault();
              if (!sendMessage.isPending) {
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <InputError message={errors.content?.message} />
        </div>

        <FileAttachmentInput
          files={files}
          onChange={setFiles}
          maxFiles={MAX_MESSAGE_FILES}
          buttonClassName="w-12 h-16"
          buttonOnly
          onValidationError={setAttachError}
        />

        <button
          type="submit"
          disabled={sendMessage.isPending}
          aria-label={t("send")}
          className="flex justify-center items-center bg-primary hover:opacity-90 disabled:opacity-60 rounded-xl w-12 h-16 shrink-0 text-on-primary transition disabled:cursor-not-allowed"
        >
          <Send size={16} className="rtl-flip" />
        </button>
      </div>

      {(attachError || errors.files?.message) && (
        <InputError message={attachError ?? errors.files?.message} />
      )}

      {sendMessage.isError && (
        <InputError
          message={errorText(
            sendMessage.error,
            t("sendFailed"),
          )}
        />
      )}
    </form>
  );
}
