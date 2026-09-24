"use client";

import { Link2, Plus, X } from "lucide-react";
import Input from "./Input";
import InputError from "./InputError";

export interface LinkInputValue {
  url: string;
  label?: string;
}

interface LinkInputProps {
  links: LinkInputValue[];
  onChange: (links: LinkInputValue[]) => void;
  errors?: (string | undefined)[];
  maxLinks?: number;
}

// Repeatable url(+label) field group. Controlled, like FileAttachmentInput,
// so the parent form can hold both in a single submit payload.
export default function LinkInput({
  links,
  onChange,
  errors,
  maxLinks = 10,
}: LinkInputProps) {
  const handleAdd = () => {
    if (links.length >= maxLinks) return;
    onChange([...links, { url: "", label: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, patch: Partial<LinkInputValue>) => {
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  };

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex-1 space-y-1">
            <Input
              label={index === 0 ? "Delivery Link" : `Delivery Link ${index + 1}`}
              placeholder="https://..."
              dir="ltr"
              value={link.url}
              onChange={(event) => handleUpdate(index, { url: event.target.value })}
            />
            <InputError message={errors?.[index]} />
          </div>

          <div className="pt-7">
            <button
              type="button"
              onClick={() => handleRemove(index)}
              aria-label="Remove link"
              className="hover:bg-surface-muted p-2 rounded-lg text-text-secondary hover:text-danger transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}

      {links.length < maxLinks && (
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 hover:bg-surface-muted px-3 border border-border rounded-lg h-9 font-medium text-text-secondary text-sm transition"
        >
          <Link2 size={14} />
          <Plus size={12} />
          Add Link
        </button>
      )}
    </div>
  );
}
