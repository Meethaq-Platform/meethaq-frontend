import { z } from "zod";

const sharedProfileShape = {
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  country: z.string(),
};

export const clientProfileSchema = z.object(sharedProfileShape);

export type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

export const freelancerProfileSchema = z.object({
  ...sharedProfileShape,
  professionalTitle: z.string().min(1, "Professional title is required"),
  bio: z.string().max(1000, "Bio must be under 1000 characters"),
});

export type FreelancerProfileFormValues = z.infer<
  typeof freelancerProfileSchema
>;
