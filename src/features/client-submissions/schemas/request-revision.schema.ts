import { z } from "zod";

// Mirrors RequestRevisionDto. Supporting files are optional per spec.
export const requestRevisionFormSchema = z.object({
  reason: z
    .string()
    .min(1, "Explain what's wrong with this submission")
    .max(2000, "Reason is too long"),
  requiredChanges: z
    .string()
    .min(1, "Describe the required changes")
    .max(2000, "Description is too long"),
  files: z.array(z.instanceof(File)).max(10, "You can attach up to 10 files"),
});

export type RequestRevisionFormInput = z.input<typeof requestRevisionFormSchema>;
export type RequestRevisionFormValues = z.output<typeof requestRevisionFormSchema>;
