"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import AttachmentList, { type AttachmentListItem } from "./AttachmentList";
import ImageLightbox from "./ImageLightbox";

interface AttachmentGalleryProps {
  attachments: AttachmentListItem[];
}

// Attachments with images shown inline: images as thumbnails that open in a
// lightbox (with a corner button to download straight away), everything else
// as the usual AttachmentList rows. Thumbnails have a fixed size so loading
// them never shifts the layout (which would also knock the chat off its
// scrolled-to-bottom position).
export default function AttachmentGallery({ attachments }: AttachmentGalleryProps) {
  const t = useTranslations("common.files");
  const [openImage, setOpenImage] = useState<AttachmentListItem | null>(null);
  // Images that failed to load (e.g. served with a non-image content type)
  // fall back to a regular file row, so they're never just a broken box.
  const [failedIds, setFailedIds] = useState<ReadonlySet<number>>(new Set());

  const isImage = (item: AttachmentListItem) =>
    item.contentType.startsWith("image/") && !failedIds.has(item.id);
  const images = attachments.filter(isImage);
  const files = attachments.filter((item) => !isImage(item));
  const single = images.length === 1;

  return (
    <div className="space-y-2">
      {images.length > 0 && (
        <div className={single ? "" : "gap-1.5 grid grid-cols-2"}>
          {images.map((image) => (
            // Siblings rather than nested: a link can't live inside a button.
            <div
              key={image.id}
              className={`relative ${
                single ? "w-64 max-w-full h-48" : "w-32 sm:w-36 h-32 sm:h-36"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenImage(image)}
                aria-label={t("openImage", { name: image.fileName })}
                className="block bg-black/10 rounded-xl w-full h-full overflow-hidden hover:opacity-90 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- authenticated BFF file route, not optimizable by next/image */}
                <img
                  src={image.fileUrl}
                  alt={image.fileName}
                  loading="lazy"
                  onError={() =>
                    setFailedIds((prev) => new Set(prev).add(image.id))
                  }
                  className="w-full h-full object-cover"
                />
              </button>

              <a
                href={image.fileUrl}
                download={image.fileName}
                aria-label={t("downloadNamed", { name: image.fileName })}
                title={t("download")}
                className="top-1.5 absolute flex justify-center items-center bg-black/55 hover:bg-black/75 backdrop-blur-sm rounded-full w-7 h-7 text-white transition end-1.5"
              >
                <Download size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      <AttachmentList attachments={files} />

      <ImageLightbox
        image={openImage && { src: openImage.fileUrl, name: openImage.fileName }}
        onClose={() => setOpenImage(null)}
      />
    </div>
  );
}
