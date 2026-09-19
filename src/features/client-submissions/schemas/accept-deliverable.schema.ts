import { z } from "zod";

// Mirrors AcceptDeliverableDto — note is optional per spec.
export const acceptDeliverableFormSchema = z.object({
  note: z.string().max(2000, "Note is too long").optional(),
});

export type AcceptDeliverableFormValues = z.infer<typeof acceptDeliverableFormSchema>;
