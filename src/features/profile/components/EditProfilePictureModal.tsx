"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { useDeleteProfilePicture } from "../hooks/useDeleteProfilePicture";
import { useUploadProfilePicture } from "../hooks/useUploadProfilePicture";
import Button from "@/src/shared/components/Button";
import Modal from "@/src/shared/components/Modal";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface EditProfilePictureModalProps {
  open: boolean;
  onClose: () => void;
  fullName: string;
  profileImage: string | null;
}

export function EditProfilePictureModal({
  open,
  onClose,
  fullName,
  profileImage,
}: EditProfilePictureModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const upload = useUploadProfilePicture();
  const remove = useDeleteProfilePicture();
  const isBusy = upload.isPending || remove.isPending;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
    setValidationError(null);
  };

  const handleClose = () => {
    resetSelection();
    upload.reset();
    remove.reset();
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setValidationError("Please choose a JPEG, PNG, GIF, or WEBP image.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setValidationError("Image must be under 5 MB.");
      return;
    }

    setValidationError(null);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!pendingFile) return;

    upload.mutate(pendingFile, {
      onSuccess: () => {
        resetSelection();
        onClose();
      },
    });
  };

  const handleDelete = () => {
    remove.mutate(undefined, { onSuccess: resetSelection });
  };

  const displayedImage = previewUrl ?? profileImage;

  const errorMessage =
    validationError ??
    (upload.error instanceof Error ? upload.error.message : null) ??
    (remove.error instanceof Error ? remove.error.message : null);

  return (
    <Modal open={open} onClose={handleClose} title="Profile photo">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center items-center bg-primary-muted rounded-full w-32 h-32 overflow-hidden font-semibold text-primary text-3xl">
          {displayedImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayedImage}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            fullName.charAt(0).toUpperCase()
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />

        {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}

        {pendingFile ? (
          <div className="flex justify-end gap-3 w-full">
            <button
              type="button"
              onClick={resetSelection}
              disabled={upload.isPending}
              className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-10 font-semibold text-text-secondary text-sm transition"
            >
              Cancel
            </button>

            <Button
              type="button"
              onClick={handleSave}
              loading={upload.isPending}
              loadingText="Saving..."
            >
              Save Photo
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="flex items-center gap-1.5 bg-primary hover:opacity-90 disabled:opacity-60 px-4 rounded-xl h-10 font-semibold text-on-primary text-sm transition"
            >
              <Upload size={14} />
              Upload Photo
            </button>

            {profileImage && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isBusy}
                className="flex items-center gap-1.5 hover:bg-danger-muted disabled:opacity-60 px-4 rounded-xl h-10 font-semibold text-danger text-sm transition"
              >
                {remove.isPending && <Loader2 size={14} className="animate-spin" />}
                Delete Photo
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
