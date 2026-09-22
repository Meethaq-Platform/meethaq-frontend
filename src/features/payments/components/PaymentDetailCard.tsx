import type { MilestonePayment } from "../types/payment";
import AttachmentList from "@/src/shared/components/AttachmentList";
import { formatCurrency, formatDateTime } from "@/src/shared/lib/format";

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
          <p className="text-text-secondary text-xs">Method</p>
          <p className="text-text-primary">{payment.paymentMethod}</p>
        </div>
        <div>
          <p className="text-text-secondary text-xs">Amount</p>
          <p className="font-numbers text-text-primary">
            {formatCurrency(payment.amount, payment.currency)}
          </p>
        </div>
        {payment.paymentDate && (
          <div>
            <p className="text-text-secondary text-xs">Payment Date</p>
            <p className="text-text-primary">{formatDateTime(payment.paymentDate)}</p>
          </div>
        )}
        {payment.transactionReference && (
          <div>
            <p className="text-text-secondary text-xs">Reference</p>
            <p className="text-text-primary">{payment.transactionReference}</p>
          </div>
        )}
      </div>

      {payment.paymentNotes && (
        <div>
          <p className="text-text-secondary text-xs">Notes</p>
          <p className="text-text-primary whitespace-pre-wrap">{payment.paymentNotes}</p>
        </div>
      )}

      {evidenceItems.length > 0 && (
        <div>
          <p className="mb-1.5 text-text-secondary text-xs">Evidence</p>
          <AttachmentList attachments={evidenceItems} />
        </div>
      )}

      {payment.confirmedAt && (
        <div className="bg-success-muted p-3 rounded-lg text-success text-xs">
          Confirmed {formatDateTime(payment.confirmedAt)}
        </div>
      )}

      {payment.corrections.length > 0 && (
        <div>
          <p className="mb-1.5 text-text-secondary text-xs">Correction History</p>
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
                    Submitted {formatDateTime(correction.submittedAt)}
                  </p>
                  {correction.transactionReference && (
                    <p className="mt-1 text-text-primary text-sm">
                      Ref: {correction.transactionReference}
                    </p>
                  )}
                  {correction.correctionNotes && (
                    <p className="mt-1 text-text-primary text-sm whitespace-pre-wrap">
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
