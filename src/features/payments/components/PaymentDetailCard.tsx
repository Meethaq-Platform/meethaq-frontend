import type { MilestonePayment } from "../types/payment";
import AttachmentList from "@/src/shared/components/AttachmentList";
import { formatCurrency } from "@/src/shared/lib/format";
import { useFormat } from "@/src/shared/hooks/useFormat";
import { useTranslations } from "next-intl";

interface PaymentDetailCardProps {
  projectId: string;
  payment: MilestonePayment;
}

// Never trust PaymentEvidenceFile.downloadUrl directly (raw backend-relative
// path) — every consumer builds this same BFF-proxied URL from the ids
// instead, matching SubmissionEvidenceFile's convention.
function toFileUrl(projectId: string, fileId: number) {
  return `/api/projects/${projectId}/files/payments/${fileId}`;
}

export function PaymentDetailCard({ projectId, payment }: PaymentDetailCardProps) {
  const t = useTranslations("payments.detail");
  const tMethods = useTranslations("payments.methodNames");
  const format = useFormat();
  const methodKey = payment.paymentMethod as "BankTransfer";
  const method = tMethods.has(methodKey) ? tMethods(methodKey) : payment.paymentMethod;

  const evidenceItems = payment.evidenceFiles.map((file) => ({
    id: file.id,
    fileName: file.fileName,
    fileUrl: toFileUrl(projectId, file.id),
    fileSizeBytes: file.fileSizeBytes,
    contentType: file.contentType,
  }));

  return (
    <div className="space-y-4 bg-surface-muted p-4 rounded-xl text-sm">
      <div className="gap-3 grid grid-cols-2">
        <div>
          <p className="text-text-secondary text-xs">{t("method")}</p>
          <p className="text-text-primary">{method}</p>
        </div>
        <div>
          <p className="text-text-secondary text-xs">{t("amount")}</p>
          <p className="font-numbers text-text-primary">
            {formatCurrency(payment.amount, payment.currency)}
          </p>
        </div>
        {payment.paymentDate && (
          <div>
            <p className="text-text-secondary text-xs">{t("paymentDate")}</p>
            <p className="text-text-primary">{format.dateTime(payment.paymentDate)}</p>
          </div>
        )}
        {payment.transactionReference && (
          <div>
            <p className="text-text-secondary text-xs">{t("reference")}</p>
            <p className="text-text-primary">
              <bdi>{payment.transactionReference}</bdi>
            </p>
          </div>
        )}
      </div>

      {payment.paymentNotes && (
        <div>
          <p className="text-text-secondary text-xs">{t("notes")}</p>
          <p dir="auto" className="text-text-primary whitespace-pre-wrap">{payment.paymentNotes}</p>
        </div>
      )}

      {evidenceItems.length > 0 && (
        <div>
          <p className="mb-1.5 text-text-secondary text-xs">{t("evidence")}</p>
          <AttachmentList attachments={evidenceItems} />
        </div>
      )}

      {payment.confirmedAt && (
        <div className="bg-success-muted p-3 rounded-lg text-success text-xs">
          {t("confirmed", { date: format.dateTime(payment.confirmedAt) })}
        </div>
      )}

      {payment.corrections.length > 0 && (
        <div>
          <p className="mb-1.5 text-text-secondary text-xs">{t("corrections")}</p>
          <div className="space-y-2">
            {payment.corrections.map((correction) => {
              const correctionFiles = correction.evidenceFiles.map((file) => ({
                id: file.id,
                fileName: file.fileName,
                fileUrl: toFileUrl(projectId, file.id),
                fileSizeBytes: file.fileSizeBytes,
                contentType: file.contentType,
              }));

              return (
                <div key={correction.id} className="bg-surface p-3 border border-border rounded-lg">
                  <p className="text-text-secondary text-xs">
                    {t("submitted", { date: format.dateTime(correction.submittedAt) })}
                  </p>
                  {correction.transactionReference && (
                    <p className="mt-1 text-text-primary text-sm">
                      {t.rich("ref", {
                        reference: correction.transactionReference,
                        bdi: (chunks) => <bdi>{chunks}</bdi>,
                      })}
                    </p>
                  )}
                  {correction.correctionNotes && (
                    <p dir="auto" className="mt-1 text-text-primary text-sm whitespace-pre-wrap">
                      {correction.correctionNotes}
                    </p>
                  )}
                  {correctionFiles.length > 0 && (
                    <div className="mt-2">
                      <AttachmentList attachments={correctionFiles} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
