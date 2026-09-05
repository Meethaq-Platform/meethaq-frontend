import { z } from "zod";

export const addClientSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  companyName: z.string().max(100, "Company name is too long").optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
});

export type AddClientFormValues = z.infer<typeof addClientSchema>;
