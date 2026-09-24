"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

import { ProfileSectionCard } from "./ProfileSectionCard";

interface BioCardProps {
  bio: string | null;
  onStartEditing?: () => void;
}

export function BioCard({ bio, onStartEditing }: BioCardProps) {
  const [isOpen, setIsOpen] = useState(Boolean(bio));

  return (
    <ProfileSectionCard
      title="Bio"
      icon={FileText}
      titleClassName="font-medium text-text-secondary text-sm"
      action={
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse bio" : "Expand bio"}
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
            Add a short bio to tell people about yourself.
          </button>
        ))}
    </ProfileSectionCard>
  );
}
