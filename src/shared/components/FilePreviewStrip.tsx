"use client";

import { useCallback } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { FileTypeIcon, formatFileSize } from "./AttachmentList";

interface FilePreviewStripProps {
  files: File[];
  onRemove: (index: number) => void;
}

// Files picked but not sent yet, shown as a horizontal strip of previews:
// images as thumbnails, anything else as a small card with its type icon,
// name and size. Each has its own remove button.
export default function FilePreviewStrip({ files, onRemove }: FilePreviewStripProps) {
  const t = useTranslations("common.files");

  if (files.length === 0) return null;

  return (
    <ul className="flex gap-2 pt-2 pb-1 overflow-x-auto">
      {files.map((file, index) => (
        <li key={`${file.name}-${file.size}-${index}`} className="relative shrink-0">
          {file.type.startsWith("image/") ? (
            <ImagePreview file={file} />
          ) : (
            <FileCard file={file} />
          )}

          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={t("remove", { name: file.name })}
            className="-top-2 -end-2 absolute flex justify-center items-center bg-surface shadow-sm border border-border rounded-full w-6 h-6 text-text-secondary hover:text-danger transition"
          >
            <X size={12} />
          </button>
        </li>
      ))}
    </ul>
  );
}

function ImagePreview({ file }: { file: File }) {
  // The object URL lives exactly as long as the <img> it's attached to (React
  // 19 ref cleanup), so previews never leak and StrictMode can't revoke a URL
  // that's still on screen.
  const attachObjectUrl = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img) return;
      const url = URL.createObjectURL(file);
      img.src = url;
      return () => URL.revokeObjectURL(url);
    },
    [file],
  );

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local blob preview, nothing for next/image to optimize
    <img
      ref={attachObjectUrl}
      alt={file.name}
      title={file.name}
      className="bg-surface-muted border border-border rounded-xl w-16 h-16 object-cover"
    />
  );
}

function FileCard({ file }: { file: File }) {
  return (
    <div
      title={file.name}
      className="flex items-center gap-2.5 bg-surface-muted px-3 border border-border rounded-xl w-52 h-16"
    >
      <div className="flex justify-center items-center bg-surface rounded-lg w-9 h-9 shrink-0">
        <FileTypeIcon contentType={file.type} size={18} className="text-text-secondary" />
      </div>
      <div className="min-w-0">
        <p dir="auto" className="font-medium text-text-primary text-sm truncate">
          {file.name}
        </p>
        <p dir="ltr" className="text-text-secondary text-xs text-start">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
}
