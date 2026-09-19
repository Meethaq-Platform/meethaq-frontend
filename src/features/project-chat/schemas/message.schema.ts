import { z } from "zod";

// Per spec: "Empty messages without attachments cannot be sent" — content
// alone, files alone, or both together are all valid; only neither is not.
export const chatMessageFormSchema = z
  .object({
    content: z.string().max(4000, "Message is too long"),
    files: z.array(z.instanceof(File)).max(5, "You can attach up to 5 files"),
  })
  .refine((data) => data.content.trim().length > 0 || data.files.length > 0, {
    message: "Write a message or attach a file",
    path: ["content"],
  });

export type ChatMessageFormInput = z.input<typeof chatMessageFormSchema>;
export type ChatMessageFormValues = z.output<typeof chatMessageFormSchema>;
