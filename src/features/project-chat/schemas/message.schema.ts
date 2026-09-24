import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

export const MAX_MESSAGE_FILES = 5;

// Per spec: "Empty messages without attachments cannot be sent" — content
// alone, files alone, or both together are all valid; only neither is not.
// A factory, so validation messages follow the active language.
export function createChatMessageFormSchema(t: Translator<"chat.validation">) {
  return z
    .object({
      content: z.string().max(4000, t("tooLong")),
      files: z
        .array(z.instanceof(File))
        .max(MAX_MESSAGE_FILES, t("tooManyFiles", { max: MAX_MESSAGE_FILES })),
    })
    .refine((data) => data.content.trim().length > 0 || data.files.length > 0, {
      message: t("empty"),
      path: ["content"],
    });
}

type ChatMessageFormSchema = ReturnType<typeof createChatMessageFormSchema>;
export type ChatMessageFormInput = z.input<ChatMessageFormSchema>;
export type ChatMessageFormValues = z.output<ChatMessageFormSchema>;
