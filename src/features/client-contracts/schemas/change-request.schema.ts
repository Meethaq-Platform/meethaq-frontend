import { z } from "zod";

// Mirrors ContractChangeRequestDto's feedback field.
export const changeRequestSchema = z.object({
  feedback: z
    .string()
    .min(1, "Describe what needs to change")
    .max(2000, "Feedback is too long"),
});

export type ChangeRequestFormValues = z.infer<typeof changeRequestSchema>;
