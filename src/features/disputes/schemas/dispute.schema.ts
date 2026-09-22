import { z } from "zod";

export const openDisputeSchema = z.object({
  category: z.coerce.number().int().min(0).max(5) as z.ZodType<0 | 1 | 2 | 3 | 4 | 5>,
  // min(10) is a preemptive match to this backend's confirmed convention for
  // free-text "explain in detail" fields (ProposedScopeChange came back from
  // the live API requiring a 10-4000 char range) — not yet verified live for
  // these two specifically, but the same DTO-shape pattern strongly suggests
  // the same rule. Update the message if a real 400 ever proves otherwise.
  description: z
    .string()
    .min(10, "Describe the issue in at least 10 characters")
    .max(4000, "Description is too long"),
  requestedResolution: z
    .string()
    .min(10, "Describe the requested resolution in at least 10 characters")
    .max(2000, "Requested resolution is too long"),
  evidenceFiles: z.array(z.instanceof(File)).max(10, "You can attach up to 10 files"),
});

export type OpenDisputeFormInput = z.input<typeof openDisputeSchema>;
export type OpenDisputeFormValues = z.output<typeof openDisputeSchema>;

export const addEvidenceSchema = z
  .object({
    description: z.string().max(2000, "Description is too long").optional(),
    externalUrl: z
      .string()
      .regex(/^https?:\/\/.+/i, "Link must start with http:// or https://")
      .optional()
      .or(z.literal("")),
    evidenceFile: z.instanceof(File).optional(),
  })
  .refine((data) => Boolean(data.externalUrl) || Boolean(data.evidenceFile), {
    message: "Add a file or a link as evidence",
    path: ["externalUrl"],
  });

export type AddEvidenceFormValues = z.infer<typeof addEvidenceSchema>;

export const proposeResolutionSchema = z.object({
  proposedResolution: z
    .string()
    .min(10, "Describe the proposed resolution in at least 10 characters")
    .max(2000, "Too long"),
});

export type ProposeResolutionFormValues = z.infer<typeof proposeResolutionSchema>;

export const rejectResolutionSchema = z.object({
  rejectionReason: z.string().max(2000, "Reason is too long").optional(),
});

export type RejectResolutionFormValues = z.infer<typeof rejectResolutionSchema>;
