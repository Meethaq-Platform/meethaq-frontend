"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProfileSectionCard } from "./ProfileSectionCard";

interface BioCardProps {
  bio: string | null;
  onStartEditing?: () => void;
}

export function BioCard({ bio, onStartEditing }: BioCardProps) {
  const t = useTranslations("profile");
  const [isOpen, setIsOpen] = useState(Boolean(bio));

  return (
    <ProfileSectionCard
      title={t("fields.bio")}
      icon={FileText}
      titleClassName="font-medium text-text-secondary text-sm"
      action={
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? t("bio.collapse") : t("bio.expand")}
          className="hover:bg-surface-muted p-1 rounded text-text-secondary hover:text-text-primary transition"
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      }
    >
      {isOpen &&
        (bio ? (
          <p dir="auto" className="text-text-primary text-sm leading-relaxed">{bio}</p>
        ) : (
          <button
            type="button"
            onClick={onStartEditing}
            className="text-text-secondary hover:text-primary text-sm italic transition"
          >
            {t("bio.empty")}
          </button>
        ))}
    </ProfileSectionCard>
  );
}
