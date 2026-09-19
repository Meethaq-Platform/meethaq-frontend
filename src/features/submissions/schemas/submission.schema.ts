import { z } from "zod";

const submissionLinkSchema = z.object({
  url: z
    .string()
    .min(1, "Enter a link")
    .regex(/^https?:\/\/.+/i, "Link must start with http:// or https://"),
  label: z.string().max(100, "Label is too long").optional(),
});

// Mirrors CreateWorkSubmissionDto. File type/size are validated imperatively
// in FileAttachmentInput, not here — zod only enforces "at least one file or
// link" as delivery evidence.
export const submissionFormSchema = z
  .object({
    notes: z
      .string()
      .min(1, "Submission notes are required")
      .max(4000, "Notes are too long"),
    links: z.array(submissionLinkSchema).max(10, "You can add up to 10 links"),
    files: z.array(z.instanceof(File)).max(10, "You can attach up to 10 files"),
  })
  .refine((data) => data.links.length > 0 || data.files.length > 0, {
    message: "Add at least one file or delivery link",
    path: ["links"],
  });

export type SubmissionFormInput = z.input<typeof submissionFormSchema>;
export type SubmissionFormValues = z.output<typeof submissionFormSchema>;
