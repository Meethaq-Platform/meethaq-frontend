import { z } from "zod";

// Mirrors CreateMilestoneDto/UpdateMilestoneDto.
export const milestoneFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
  deliverable: z
    .string()
    .min(1, "Deliverable is required")
    .max(1000, "Deliverable is too long"),
  acceptanceCriteria: z
    .string()
    .min(1, "Acceptance criteria is required")
    .max(2000, "Acceptance criteria is too long"),
  dueDate: z.string().min(1, "Due date is required"),
  allocationValue: z.coerce
    .number({ message: "Enter a valid amount" })
    .min(0.01, "Must be greater than 0")
    .max(1000000000, "Value is too large"),
});

// react-hook-form's field values are pre-coercion (raw input strings), while
// the resolver hands the submit callback the coerced output — z.coerce.number()
// means those two shapes differ, so both must be exported.
export type MilestoneFormInput = z.input<typeof milestoneFormSchema>;
export type MilestoneFormValues = z.output<typeof milestoneFormSchema>;
