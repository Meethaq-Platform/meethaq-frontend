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
});

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
