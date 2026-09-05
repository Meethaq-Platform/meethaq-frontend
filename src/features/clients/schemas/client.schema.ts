import { z } from "zod";

export const addClientSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  email: z.string().email("Enter a valid email address"),
  companyName: z.string().max(100, "Company name is too long").optional(),
});

export type AddClientFormValues = z.infer<typeof addClientSchema>;
