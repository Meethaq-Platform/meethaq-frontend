"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

interface FileAttachmentInputProps {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string[];
  maxSizeBytes?: number;
  maxFiles?: number;
  label?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

const DEFAULT_MAX_SIZE_BYTES = 25 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Generalizes EditProfilePictureModal's single-file upload block into a
// reusable multi-file picker. Client-side MIME/size validation before adding
// to the pending list — matches that component's precedent.
export default function FileAttachmentInput({
  files,
  onChange,
  accept = DEFAULT_ACCEPTED_TYPES,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
  maxFiles = 10,
  label,
}: FileAttachmentInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (selected.length === 0) return;

    if (files.length + selected.length > maxFiles) {
      setValidationError(`You can attach up to ${maxFiles} files.`);
      return;
    }

    for (const file of selected) {
      if (!accept.includes(file.type)) {
        setValidationError(`"${file.name}" is not a supported file type.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setValidationError(
          `"${file.name}" is too large. Max size is ${formatFileSize(maxSizeBytes)}.`,
        );
        return;
      }
    }

    setValidationError(null);
    onChange([...files, ...selected]);
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label={label ? undefined : "Attach files"}
        className={
          label
            ? "flex items-center gap-2 hover:bg-surface-muted px-4 border border-border rounded-xl h-11 font-semibold text-text-secondary text-sm whitespace-nowrap transition"
            : "flex justify-center items-center hover:bg-surface-muted border border-border rounded-xl w-11 h-11 text-text-secondary transition"
        }
      >
        <Paperclip size={14} className="shrink-0" />
        {label}
      </button>

      {validationError && (
        <p className="text-danger text-sm">{validationError}</p>
      )}

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex justify-between items-center gap-3 bg-surface-muted px-3 py-2 rounded-lg text-sm"
            >
              <span className="flex-1 min-w-0 text-text-primary truncate">
                {file.name}
              </span>
              <span className="text-text-secondary text-xs shrink-0">
                {formatFileSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Remove ${file.name}`}
                className="text-text-secondary hover:text-danger transition shrink-0"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
