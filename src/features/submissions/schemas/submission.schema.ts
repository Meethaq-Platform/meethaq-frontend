import { z } from "zod";

import type { Translator } from "@/src/i18n/types";

type ValidationT = Translator<"submissions.validation">;

const MAX_LINKS = 10;
const MAX_FILES = 10;

// Mirrors CreateWorkSubmissionDto. File type/size are validated imperatively
// in FileAttachmentInput, not here — zod only enforces "at least one file or
// link" as delivery evidence. A factory, so validation messages follow the
// active language.
export function createSubmissionFormSchema(t: ValidationT) {
  const submissionLinkSchema = z.object({
    url: z
      .string()
      .min(1, t("linkRequired"))
      .regex(/^https?:\/\/.+/i, t("linkInvalid")),
    label: z.string().max(100, t("labelTooLong")).optional(),
  });

  return z
    .object({
      notes: z
        .string()
        .min(1, t("notesRequired"))
        .max(4000, t("notesTooLong")),
      links: z.array(submissionLinkSchema).max(MAX_LINKS, t("tooManyLinks", { max: MAX_LINKS })),
      files: z.array(z.instanceof(File)).max(MAX_FILES, t("tooManyFiles", { max: MAX_FILES })),
    })
    .refine((data) => data.links.length > 0 || data.files.length > 0, {
      message: t("evidenceRequired"),
      path: ["links"],
    });
}

type SubmissionFormSchema = ReturnType<typeof createSubmissionFormSchema>;
export type SubmissionFormInput = z.input<SubmissionFormSchema>;
export type SubmissionFormValues = z.output<SubmissionFormSchema>;
