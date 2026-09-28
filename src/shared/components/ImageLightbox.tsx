"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useIsMounted } from "./Modal";

interface ImageLightboxProps {
  image: { src: string; name: string } | null;
  onClose: () => void;
}

// Full-screen view of one image with Download and Close. Closes on Escape or
// a click on the backdrop. Download uses the anchor's download attribute, so
// the file is saved only when asked for.
export default function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const t = useTranslations("common");
  const mounted = useIsMounted();

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  if (!image || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.name}
      className="z-50 fixed inset-0 flex flex-col bg-black/85"
      onClick={onClose}
    >
      <div className="flex justify-between items-center gap-3 px-4 py-3 text-white shrink-0">
        <p dir="auto" className="min-w-0 font-medium text-sm truncate">
          {image.name}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={image.src}
            download={image.name}
            onClick={(event) => event.stopPropagation()}
            aria-label={t("files.download")}
            className="flex items-center gap-1.5 hover:bg-white/10 px-3 rounded-lg h-9 font-semibold text-sm transition"
          >
            <Download size={16} />
            <span className="hidden sm:inline">{t("files.download")}</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("states.close")}
            className="flex justify-center items-center hover:bg-white/10 rounded-lg w-9 h-9 transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center p-4 pt-0 min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- authenticated BFF file route, not optimizable by next/image */}
        <img
          src={image.src}
          alt={image.name}
          onClick={(event) => event.stopPropagation()}
          className="rounded-lg max-w-full max-h-full object-contain"
        />
      </div>
    </div>,
    document.body,
  );
}
