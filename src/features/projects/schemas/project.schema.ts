import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

// PUT /projects/{id} is a full-replacement update, so both fields are always
// sent (an empty string clears the description rather than leaving it unset).
export const updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title is too long"),
  description: z.string().max(2000, "Description is too long"),
  totalValue: z
    .union([
      z.literal(""),
      z.coerce
        .number({ message: "Enter a valid amount" })
        .min(0.01, "Must be greater than 0")
        .max(1000000000, "Value is too large"),
    ])
    .optional(),
});

// react-hook-form's field values are pre-coercion (raw input strings), while
// the resolver hands the submit callback the coerced output — z.coerce.number()
// means those two shapes differ, so both must be exported.
export type UpdateProjectFormInput = z.input<typeof updateProjectSchema>;
export type UpdateProjectFormValues = z.output<typeof updateProjectSchema>;
