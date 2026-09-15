import { z } from "zod";

// Mirrors CreateContractDto/UpdateContractDto — the API uses the same shape
// for both create and update (full replacement), so one schema covers both.
export const contractFormSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(150, "Title is too long"),
    scopeOfWork: z
      .string()
      .min(1, "Scope of work is required")
      .max(5000, "Scope of work is too long"),
    startDate: z.string().min(1, "Start date is required"),
    expectedEndDate: z.string().min(1, "Expected end date is required"),
    generalTerms: z.string().max(5000, "General terms are too long").optional(),
    allocationMode: z.union([z.literal(0), z.literal(1)]),
  })
  .refine((data) => new Date(data.expectedEndDate) >= new Date(data.startDate), {
    message: "Expected end date must be on or after the start date",
    path: ["expectedEndDate"],
  });

export type ContractFormValues = z.infer<typeof contractFormSchema>;
