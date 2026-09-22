import { z } from "zod";

// Milestone deltas are managed as plain component state in
// CreateChangeRequestModal (each row's fields are pre-filled from the
// selected milestone's current terms, closer to an "edit milestone" form
// than a flat field list) — validated there directly rather than through
// this schema, since react-hook-form's array registration doesn't fit a
// per-row editable-copy UI well. This schema only covers the flat fields.
export const createChangeRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  reason: z.string().min(1, "Reason is required").max(2000, "Reason is too long"),
  // CONFIRMED required by the live backend (a 400 response named this field
  // required with a 10-4000 char range) despite reading as optional in the
  // sprint doc and having no `required` marker in swagger.
  proposedScopeChange: z
    .string()
    .min(10, "Describe the scope change in at least 10 characters")
    .max(4000, "Description is too long"),
  resultingProjectValue: z.coerce.number().positive("Resulting value must be greater than zero"),
  attachments: z.array(z.instanceof(File)).max(10, "You can attach up to 10 files"),
});

export type CreateChangeRequestFormInput = z.input<typeof createChangeRequestSchema>;
export type CreateChangeRequestFormValues = z.output<typeof createChangeRequestSchema>;

export const decideChangeRequestSchema = z.object({
  rejectionReason: z.string().max(2000, "Reason is too long").optional(),
});

export type DecideChangeRequestFormValues = z.infer<typeof decideChangeRequestSchema>;
