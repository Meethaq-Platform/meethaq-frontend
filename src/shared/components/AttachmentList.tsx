import { Download, FileArchive, FileImage, FileText, File as FileIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export interface AttachmentListItem {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  contentType: string;
}

interface AttachmentListProps {
  attachments: AttachmentListItem[];
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Picks the icon for a MIME type. A component (not a function returning one)
// so the React Compiler can see every icon is a static component.
export function FileTypeIcon({
  contentType,
  size,
  className,
}: {
  contentType: string;
  size: number;
  className?: string;
}) {
  if (contentType.startsWith("image/")) return <FileImage size={size} className={className} />;
  if (contentType.includes("zip")) return <FileArchive size={size} className={className} />;
  if (contentType === "application/pdf" || contentType.startsWith("text/")) {
    return <FileText size={size} className={className} />;
  }
  return <FileIcon size={size} className={className} />;
}

// Read-only render of already-uploaded attachments, always pointing at the
// BFF attachment-proxy route — never a raw backend URL, since these files
// are project-confidential. The row opens the file; the button at its end
// downloads it (siblings, since links can't nest).
export default function AttachmentList({ attachments }: AttachmentListProps) {
  const t = useTranslations("common.files");

  if (attachments.length === 0) return null;

  return (
    <ul className="space-y-1.5">
      {attachments.map((attachment) => (
        <li
          key={attachment.id}
          className="flex items-center bg-surface-muted hover:bg-border/40 pe-1 rounded-lg transition"
        >
          <a
            href={attachment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center gap-3 px-3 py-2 min-w-0 text-sm"
          >
            <FileTypeIcon
              contentType={attachment.contentType}
              size={16}
              className="shrink-0 text-text-secondary"
            />
            <span className="flex-1 min-w-0 font-medium text-text-primary truncate">
              {attachment.fileName}
            </span>
            <span dir="ltr" className="shrink-0 text-text-secondary text-xs">
              {formatFileSize(attachment.fileSizeBytes)}
            </span>
          </a>
          <a
            href={attachment.fileUrl}
            download={attachment.fileName}
            aria-label={t("downloadNamed", { name: attachment.fileName })}
            title={t("download")}
            className="flex justify-center items-center hover:bg-border/60 rounded-full w-7 h-7 text-text-secondary hover:text-text-primary transition shrink-0"
          >
            <Download size={14} />
          </a>
        </li>
      ))}
    </ul>
  );
}
